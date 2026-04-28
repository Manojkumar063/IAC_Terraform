import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { loadDocuments, embedText, retrieve, generate } from "./rag.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, "documents");

async function main() {
  const query = process.argv[2] || "What is AWS Lambda?";
  console.log(`\n🔍 Query: ${query}\n`);

  // 1. Load documents into chunks
  console.log("📄 Loading documents...");
  const chunks = loadDocuments(DOCS_DIR);

  // 2. Embed all chunks (in parallel)
  console.log(`🔢 Embedding ${chunks.length} chunks...`);
  const chunkEmbeddings = await Promise.all(chunks.map(c => embedText(c.text)));

  // 3. Embed the query
  const queryEmbedding = await embedText(query);

  // 4. Retrieve top relevant chunks
  const topChunks = retrieve(queryEmbedding, chunkEmbeddings, chunks, 3);
  console.log("\n📌 Retrieved context:");
  topChunks.forEach(c => console.log(`  [score: ${c.score.toFixed(3)}] ${c.text.slice(0, 80)}...`));

  // 5. Generate answer
  console.log("\n🤖 Generating answer...");
  const answer = await generate(query, topChunks);
  console.log(`\n✅ Answer:\n${answer}`);
}

main().catch(console.error);
