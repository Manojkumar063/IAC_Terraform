import shutil
from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile

import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "src"))

from rag import Ingestor
from rag.config import settings

router = APIRouter()


@router.post("")
async def ingest_documents(files: list[UploadFile]) -> dict:
    docs_path = Path(settings.docs_dir)
    docs_path.mkdir(exist_ok=True)

    saved = []
    for file in files:
        if not file.filename.endswith(".txt"):
            raise HTTPException(status_code=400, detail=f"Only .txt files accepted: {file.filename}")
        dest = docs_path / file.filename
        with dest.open("wb") as f:
            shutil.copyfileobj(file.file, f)
        saved.append(file.filename)

    try:
        Ingestor().run()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return {"ingested": saved}
