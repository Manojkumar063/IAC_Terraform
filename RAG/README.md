# RAG Project

A production-ready Retrieval-Augmented Generation (RAG) pipeline built with LangChain, FAISS, and OpenAI.

## Project Structure

```
RAG/
├── src/rag/
│   ├── config.py        # Pydantic settings (loaded from .env)
│   ├── ingestor.py      # Document loading & vectorstore creation
│   ├── retriever.py     # RAG chain & query logic
│   └── logger.py        # Structured logging
├── docs/                # Place your .txt knowledge base files here
├── tests/               # Unit tests
├── main.py              # CLI entry point
├── pyproject.toml       # Project metadata & dependencies
└── .env.example         # Environment variable reference
```

## Setup

**1. Create and activate a virtual environment:**
```bash
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate   # macOS/Linux
```

**2. Install dependencies:**
```bash
pip install -e ".[dev]"
```

**3. Configure environment:**
```bash
copy .env.example .env      # Windows
cp .env.example .env        # macOS/Linux
# Edit .env and set your OPENAI_API_KEY
```

## Usage

**Ingest documents** (run once, or after adding new docs):
```bash
python main.py ingest
```

**Interactive Q&A:**
```bash
python main.py query
```

**One-shot question:**
```bash
python main.py query -q "What is AWS Lambda?"
```

## Testing

```bash
pytest
```

## Configuration

All settings are controlled via `.env`. See `.env.example` for all available options.
To swap models or tune chunking, update the values in `.env` — no code changes needed.
