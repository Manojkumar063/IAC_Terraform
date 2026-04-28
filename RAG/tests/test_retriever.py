import pytest
from unittest.mock import MagicMock, patch


def test_retriever_raises_when_no_vectorstore(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    with patch("src.rag.retriever.settings.vectorstore_dir", "/nonexistent/path"):
        from src.rag.retriever import RAGRetriever
        with pytest.raises(FileNotFoundError):
            RAGRetriever()


def test_retriever_query_returns_answer(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    (tmp_path / "index.faiss").touch()

    mock_chain = MagicMock()
    mock_chain.invoke.return_value = {"result": "AWS is a cloud platform."}

    with (
        patch("src.rag.retriever.settings.vectorstore_dir", str(tmp_path)),
        patch("src.rag.retriever.OpenAIEmbeddings"),
        patch("src.rag.retriever.FAISS.load_local"),
        patch("src.rag.retriever.ChatOpenAI"),
        patch("src.rag.retriever.RetrievalQA.from_chain_type", return_value=mock_chain),
    ):
        from src.rag.retriever import RAGRetriever
        retriever = RAGRetriever()
        answer = retriever.query("What is AWS?")
        assert answer == "AWS is a cloud platform."


def test_retriever_raises_on_empty_question(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    (tmp_path / "index.faiss").touch()

    with (
        patch("src.rag.retriever.settings.vectorstore_dir", str(tmp_path)),
        patch("src.rag.retriever.OpenAIEmbeddings"),
        patch("src.rag.retriever.FAISS.load_local"),
        patch("src.rag.retriever.ChatOpenAI"),
        patch("src.rag.retriever.RetrievalQA.from_chain_type"),
    ):
        from src.rag.retriever import RAGRetriever
        retriever = RAGRetriever()
        with pytest.raises(ValueError):
            retriever.query("   ")
