import os
import glob
import shutil
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from rag_engine import rebuild_user_index, load_vectorstore, retrieve_top_k, generate_answer

app = FastAPI()

# ==================================================
# CORS CONFIGURATION
# ==================================================
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================================================
# AUTHENTICATION STUB
# ==================================================
def get_current_user_id():
    # Replace with real auth logic in production
    return "test_user_123"

# ==================================================
# Pydantic Model for /query
# ==================================================
class QueryRequest(BaseModel):
    question: str

# ==================================================
# POST /upload
# ==================================================
@app.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id),
):
    cwd = os.getcwd()
    user_upload_folder = os.path.join(cwd, "uploads", user_id)
    os.makedirs(user_upload_folder, exist_ok=True)

    local_file_path = os.path.join(user_upload_folder, file.filename)
    try:
        with open(local_file_path, "wb") as buffer:
            buffer.write(await file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {e}")

    # Rebuild FAISS index
    try:
        rebuild_user_index(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error rebuilding FAISS index: {e}")

    return {"status": "uploaded_and_index_rebuilt", "filename": file.filename}

# ==================================================
# GET /uploads
# ==================================================
@app.get("/uploads")
async def list_uploaded_files(user_id: str = Depends(get_current_user_id)):
    cwd = os.getcwd()
    user_folder = os.path.join(cwd, "uploads", user_id)

    if not os.path.isdir(user_folder):
        return {"filenames": []}

    filenames = [
        os.path.basename(path)
        for path in glob.glob(os.path.join(user_folder, "*"))
        if os.path.isfile(path)
    ]
    return {"filenames": filenames}

# ==================================================
# DELETE /upload/{filename}
# ==================================================
@app.delete("/upload/{filename}")
async def delete_document(
    filename: str,
    user_id: str = Depends(get_current_user_id),
):
    cwd = os.getcwd()
    user_folder = os.path.join(cwd, "uploads", user_id)
    file_path = os.path.join(user_folder, filename)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    # 1. Delete the file from disk
    try:
        os.remove(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not delete file: {e}")

    # 2. Attempt to rebuild the index. If there are no more files, catch ValueError:
    try:
        rebuild_user_index(user_id)
    except ValueError as ve:
        # This typically means "No supported files (.docx, .pdf, .txt) in folder"
        # In that case, remove any existing FAISS folder entirely.
        index_folder = os.path.join(cwd, "faiss_indexes", user_id)
        if os.path.isdir(index_folder):
            shutil.rmtree(index_folder)
        # Return success, since we've removed the last document.
        return {"status": "deleted_and_index_cleared", "filename": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error rebuilding FAISS index: {e}")

    return {"status": "deleted_and_index_rebuilt", "filename": filename}

# ==================================================
# POST /query
# ==================================================
@app.post("/query")
async def query_rag(req: QueryRequest, user_id: str = Depends(get_current_user_id)):
    vectorstore = load_vectorstore(user_id)
    if vectorstore is None:
        raise HTTPException(
            status_code=404,
            detail="No FAISS index found for this user. Upload some documents first."
        )

    try:
        docs = retrieve_top_k(vectorstore, req.question, k=5)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during retrieval: {e}")

    try:
        answer = generate_answer(req.question, docs)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating answer: {e}")

    return {"answer": answer}

# ==================================================
# GET /
# ==================================================
@app.get("/")
async def root():
    return {"message": "RAG FastAPI server is running"}
