# Gemini RAG (Retrieval Augmented Generation)

A minimal RAG pipeline using Google Gemini API.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add your Gemini API key to `.env`:
   ```
   GEMINI_API_KEY=your_actual_key_here
   ```

## Usage

```bash
# Default query
node index.js

# Custom query
node index.js "What is Amazon S3?"
node index.js "How does DynamoDB work?"
```

## How it works

```
Documents → Chunks → Embeddings (text-embedding-004)
                          ↓
Query → Embedding → Cosine Similarity → Top-K Chunks
                                              ↓
                                    Gemini 1.5 Flash → Answer
```

## Add your own documents

Drop any `.txt` files into the `documents/` folder. They will be automatically chunked by paragraph and embedded on the next run.
