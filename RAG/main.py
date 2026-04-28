import argparse
import sys

from src.rag import Ingestor, RAGRetriever
from src.rag.logger import get_logger

logger = get_logger(__name__)


def cmd_ingest(_args: argparse.Namespace) -> None:
    Ingestor().run()


def cmd_query(args: argparse.Namespace) -> None:
    retriever = RAGRetriever()
    if args.question:
        print(retriever.query(args.question))
    else:
        print("RAG ready. Type 'exit' to quit.\n")
        while True:
            try:
                question = input("Question: ").strip()
            except (KeyboardInterrupt, EOFError):
                break
            if question.lower() == "exit":
                break
            if question:
                print(f"Answer: {retriever.query(question)}\n")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="rag",
        description="Retrieval-Augmented Generation CLI",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("ingest", help="Ingest documents into the vectorstore")

    query_parser = sub.add_parser("query", help="Query the RAG pipeline")
    query_parser.add_argument(
        "-q", "--question", type=str, default=None, help="One-shot question"
    )
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    handlers = {"ingest": cmd_ingest, "query": cmd_query}
    try:
        handlers[args.command](args)
    except (FileNotFoundError, ValueError) as exc:
        logger.error("%s", exc)
        sys.exit(1)


if __name__ == "__main__":
    main()
