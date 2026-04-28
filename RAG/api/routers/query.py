import asyncio
import json
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "src"))

from rag import RAGRetriever

router = APIRouter()


class QueryRequest(BaseModel):
    question: str


def _get_retriever() -> RAGRetriever:
    try:
        return RAGRetriever()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc))


@router.post("")
def query(body: QueryRequest) -> dict:
    try:
        answer = _get_retriever().query(body.question)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    return {"answer": answer}


@router.post("/stream")
async def query_stream(body: QueryRequest) -> StreamingResponse:
    retriever = _get_retriever()

    async def event_generator():
        try:
            answer = await asyncio.to_thread(retriever.query, body.question)
            for word in answer.split(" "):
                chunk = json.dumps({"token": word + " "})
                yield f"data: {chunk}\n\n"
                await asyncio.sleep(0.03)
            yield "data: [DONE]\n\n"
        except ValueError as exc:
            yield f"data: {json.dumps({'error': str(exc)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
