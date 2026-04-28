from pathlib import Path

from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

from .config import settings
from .logger import get_logger

logger = get_logger(__name__)


class RAGRetriever:
    def __init__(self) -> None:
        vectorstore_path = Path(settings.vectorstore_dir)
        if not vectorstore_path.exists():
            raise FileNotFoundError(
                f"Vectorstore not found at '{vectorstore_path}'. Run ingest first."
            )

        embeddings = OpenAIEmbeddings(
            model=settings.openai_embedding_model,
            api_key=settings.openai_api_key,
        )
        vectorstore = FAISS.load_local(
            str(vectorstore_path),
            embeddings,
            allow_dangerous_deserialization=True,
        )
        llm = ChatOpenAI(
            model=settings.openai_model,
            temperature=settings.llm_temperature,
            api_key=settings.openai_api_key,
        )
        self._chain = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=vectorstore.as_retriever(
                search_kwargs={"k": settings.retriever_top_k}
            ),
        )
        logger.info("RAG chain initialized (model=%s)", settings.openai_model)

    def query(self, question: str) -> str:
        if not question.strip():
            raise ValueError("Question must not be empty.")
        logger.info("Query: %s", question)
        result = self._chain.invoke({"query": question})
        return result["result"]
