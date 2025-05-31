from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from rag_engine import load_vectorstore, retrieve_top_k, generate_answer

app = FastAPI()

# Load vectorstore once on startup
vectorstore = load_vectorstore()

class QueryRequest(BaseModel):
    question: str

@app.post("/query")
async def query_rag(req: QueryRequest):
    try:
        docs = retrieve_top_k(vectorstore, req.question, k=5)
        answer = generate_answer(req.question, docs)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "RAG FastAPI server is running"}
