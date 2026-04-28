import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const CACHE_FILE = "./embeddings-cache.json";
const CHUNK_SIZE = 500;   // characters
const CHUNK_OVERLAP = 100; // characters
const MIN_CHUNK_LEN = 60;
const SCORE_THRESHOLD = 0.3;

// ── 1. Sliding-window chunker ─────────────────────────────────────────────────
function splitWithOverlap(text, source) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = start + CHUNK_SIZE;
    const chunk = text.slice(start, end).trim();
    if (chunk.length >= MIN_CHUNK_LEN) chunks.push({ text: chunk, source });
    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }
  return chunks;
}

// ── 2. Load documents ─────────────────────────────────────────────────────────
export function loadDocuments(docsDir) {
  const chunks = [];
  for (const file of fs.readdirSync(docsDir)) {
    const text = fs.readFileSync(path.join(docsDir, file), "utf-8");
    chunks.push(...splitWithOverlap(text, file));
  }
  return chunks;
}

// ── 3. Chunk uploaded text (PDF etc.) ────────────────────────────────────────
export function chunkText(text, source) {
  return splitWithOverlap(text, source);
}

// ── 4. Embed with caching ─────────────────────────────────────────────────────
const embeddingCache = fs.existsSync(CACHE_FILE)
  ? JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"))
  : {};

function saveCache() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(embeddingCache));
}

export async function embedText(text) {
  if (embeddingCache[text]) return embeddingCache[text];
  const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });
  const result = await model.embedContent(text);
  const vector = result.embedding.values;
  embeddingCache[text] = vector;
  saveCache();
  return vector;
}

// ── 5. Cosine similarity ──────────────────────────────────────────────────────
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  return dot / (magA * magB);
}

// ── 6. Retrieve top-k with score threshold ────────────────────────────────────
export function retrieve(queryEmbedding, chunkEmbeddings, chunks, topK = 4) {
  return chunks
    .map((chunk, i) => ({ ...chunk, score: cosineSimilarity(queryEmbedding, chunkEmbeddings[i]) }))
    .filter(c => c.score >= SCORE_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// ── 7. Generate answer with source citations ──────────────────────────────────
export async function generate(query, contextChunks) {
  if (contextChunks.length === 0)
    return "I don't have enough relevant information to answer that question.";

  const context = contextChunks
    .map((c, i) => `[Source ${i + 1} — ${c.source} (score: ${c.score.toFixed(2)})]:\n${c.text}`)
    .join("\n\n");

  const prompt = `You are a helpful assistant. Answer ONLY using the context below. \
If the answer is not in the context, say "I don't know based on the provided documents."

Context:
${context}

Question: ${query}

Answer (cite sources like [Source 1], [Source 2] where relevant):`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}
