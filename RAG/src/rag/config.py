from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    openai_api_key: str
    openai_model: str = "gpt-3.5-turbo"
    openai_embedding_model: str = "text-embedding-3-small"

    docs_dir: str = "docs"
    vectorstore_dir: str = "vectorstore"

    chunk_size: int = 500
    chunk_overlap: int = 50
    retriever_top_k: int = 3
    llm_temperature: float = 0.0


settings = Settings()
