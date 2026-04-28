from pathlib import Path

from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

from .config import settings
from .logger import get_logger

logger = get_logger(__name__)


class Ingestor:
    def __init__(self) -> None:
        self._embeddings = OpenAIEmbeddings(
            model=settings.openai_embedding_model,
            api_key=settings.openai_api_key,
        )
        self._splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
        )

    def run(self) -> None:
        docs_path = Path(settings.docs_dir)
        if not docs_path.exists() or not any(docs_path.glob("*.txt")):
            raise FileNotFoundError(f"No .txt files found in '{docs_path}'")

        logger.info("Loading documents from '%s'", docs_path)
        loader = DirectoryLoader(str(docs_path), glob="*.txt", loader_cls=TextLoader)
        documents = loader.load()

        chunks = self._splitter.split_documents(documents)
        logger.info("Split into %d chunks", len(chunks))

        vectorstore = FAISS.from_documents(chunks, self._embeddings)
        vectorstore.save_local(settings.vectorstore_dir)
        logger.info("Vectorstore saved to '%s'", settings.vectorstore_dir)
