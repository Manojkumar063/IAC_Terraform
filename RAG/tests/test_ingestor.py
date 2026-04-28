import pytest
from unittest.mock import MagicMock, patch


def test_ingestor_raises_when_no_docs(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    from src.rag.config import Settings
    with patch("src.rag.ingestor.settings", Settings(docs_dir=str(tmp_path), vectorstore_dir=str(tmp_path / "vs"))):
        from src.rag.ingestor import Ingestor
        with pytest.raises(FileNotFoundError):
            Ingestor().run()


def test_ingestor_runs_successfully(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    (tmp_path / "doc.txt").write_text("AWS is a cloud platform.")

    mock_vectorstore = MagicMock()
    mock_faiss = MagicMock(return_value=mock_vectorstore)

    with (
        patch("src.rag.ingestor.OpenAIEmbeddings"),
        patch("src.rag.ingestor.FAISS.from_documents", mock_faiss),
        patch("src.rag.ingestor.settings.docs_dir", str(tmp_path)),
        patch("src.rag.ingestor.settings.vectorstore_dir", str(tmp_path / "vs")),
    ):
        from src.rag.ingestor import Ingestor
        Ingestor().run()
        mock_vectorstore.save_local.assert_called_once()
