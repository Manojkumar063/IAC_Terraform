import Database from "better-sqlite3";
import fs from "fs";

// ── SQLite: users only ────────────────────────────────────────────────────────
const db = new Database("./rag.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export function createUser(username, email, hashedPassword) {
  return db.prepare("INSERT INTO users (username, email, password) VALUES (?,?,?)")
    .run(username, email, hashedPassword);
}

export function findUserByEmail(email) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}

export function findUserByUsername(username) {
  return db.prepare("SELECT * FROM users WHERE username = ?").get(username);
}

// ── JSON file: chunks ─────────────────────────────────────────────────────────
const CHUNKS_FILE = "./chunks-store.json";
let chunksStore = fs.existsSync(CHUNKS_FILE)
  ? JSON.parse(fs.readFileSync(CHUNKS_FILE, "utf-8"))
  : [];

function saveChunksFile() {
  fs.writeFileSync(CHUNKS_FILE, JSON.stringify(chunksStore));
}

export function saveChunk(text, source, embedding) {
  chunksStore.push({ text, source, embedding });
  saveChunksFile();
}

export function chunkExists(text) {
  return chunksStore.some(c => c.text === text);
}

export function getAllChunks() {
  return chunksStore;
}
