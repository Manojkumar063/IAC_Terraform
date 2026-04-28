import "dotenv/config";
import express from "express";
import morgan from "morgan";
import multer from "multer";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import path from "path";
import { fileURLToPath } from "url";
import { loadDocuments, embedText, retrieve, generate, chunkText } from "./rag.js";
import { saveChunk, chunkExists, getAllChunks } from "./db.js";
import { requireAuth } from "./authMiddleware.js";
import { setupKeycloak } from "./keycloak.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "public");

const app = express();
app.use(morgan(":method :url :status :res[content-length] bytes - :response-time ms"));
app.use(express.json());

// ── Keycloak ──────────────────────────────────────────────────────────────────
const keycloak = setupKeycloak(app);

app.use(express.static(publicDir));

// ── Serve pages ───────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.sendFile(path.join(publicDir, "auth.html")));
app.get("/chat", keycloak.protect(), (req, res) =>
  res.sendFile(path.join(publicDir, "chat.html"))
);

// ── Keycloak callback info (used by frontend to get token) ────────────────────
app.get("/api/me", requireAuth, (req, res) => res.json({ user: req.user }));

// ── Load & embed documents into SQLite on startup ─────────────────────────────
console.log("📄 Loading and embedding documents...");
const docChunks = loadDocuments(path.join(__dirname, "documents"));
for (const chunk of docChunks) {
  if (!chunkExists(chunk.text)) {
    const embedding = await embedText(chunk.text);
    saveChunk(chunk.text, chunk.source, embedding);
  }
}
console.log(`✅ Ready — documents indexed.\n`);

// ── Multer ────────────────────────────────────────────────────────────────────
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// ── Upload PDF (protected) ────────────────────────────────────────────────────
app.post("/api/upload", requireAuth, upload.single("pdf"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const data = await pdfParse(req.file.buffer);
    const newChunks = chunkText(data.text, req.file.originalname);

    if (newChunks.length === 0)
      return res.status(400).json({ error: "No readable text found in PDF" });

    let indexed = 0;
    for (const chunk of newChunks) {
      if (!chunkExists(chunk.text)) {
        const embedding = await embedText(chunk.text);
        saveChunk(chunk.text, chunk.source, embedding);
        indexed++;
      }
    }
    res.json({ message: `✅ Indexed ${indexed} new chunks from "${req.file.originalname}"` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Ask (protected) ───────────────────────────────────────────────────────────
app.post("/api/ask", requireAuth, async (req, res) => {
  const { query } = req.body;
  if (!query?.trim()) return res.status(400).json({ error: "Query is required" });

  try {
    const allChunks = getAllChunks();
    const queryEmbedding = await embedText(query);
    const topChunks = retrieve(queryEmbedding, allChunks.map(c => c.embedding), allChunks, 4);
    const answer = await generate(query, topChunks);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
