import os
import re
from typing import List, Dict
from dotenv import load_dotenv

from docx import Document
import PyPDF2

from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

# Load the OpenAI API key from environment variables
load_dotenv()
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

# -------------------
# Section 1: Preprocessing & Cleaning (unchanged)
# -------------------

def load_text(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".docx":
        doc = Document(file_path)
        text = "\n".join(p.text for p in doc.paragraphs)
    elif ext == ".pdf":
        reader = PyPDF2.PdfReader(file_path)
        text = "".join((page.extract_text() or "") + "\n" for page in reader.pages)
    elif ext == ".txt":
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
    else:
        raise ValueError(f"Unsupported file type: {ext}")
    return text

def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()

def preprocess_documents(folder: str) -> List[Dict]:
    """
    For every .docx / .pdf / .txt in `folder`, load, clean, chunk, and return
    a list of { "text": chunk, "metadata": { "source": filename, "chunk_index": i } }.
    """
    if not os.path.isdir(folder):
        raise FileNotFoundError(f"Uploads folder not found: {folder}")

    valid_exts = {".docx", ".pdf", ".txt"}
    all_files = [
        os.path.join(folder, fname)
        for fname in os.listdir(folder)
        if os.path.splitext(fname)[1].lower() in valid_exts
    ]
    if not all_files:
        raise ValueError(f"No supported files (.docx, .pdf, .txt) in folder: {folder}")

    from langchain.text_splitter import RecursiveCharacterTextSplitter

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    all_chunks: List[Dict] = []

    for fp in all_files:
        raw = load_text(fp)
        cleaned = clean_text(raw)
        chunks = splitter.split_text(cleaned)
        for i, chunk in enumerate(chunks):
            all_chunks.append({
                "text": chunk,
                "metadata": {
                    "source": os.path.basename(fp),
                    "chunk_index": i
                }
            })

    return all_chunks

# -------------------
# Section 2: Build / Re‐build the FAISS Index for a specific user
# -------------------

def rebuild_user_index(user_id: str) -> FAISS:
    """
    1. Look at all files under ./uploads/{user_id}/
    2. Preprocess them into chunks
    3. Embed them via OpenAIEmbeddings
    4. Build a brand‐new FAISS index (FAISS.from_texts)
    5. Save it under ./faiss_indexes/{user_id}/
    6. Return the newly created vectorstore
    """
    # 1. Determine user’s upload folder & index folder
    cwd = os.getcwd()
    upload_folder = os.path.join(cwd, "uploads", user_id)
    index_folder = os.path.join(cwd, "faiss_indexes", user_id)

    # 2. Preprocess documents (this will raise if folder missing or empty)
    docs = preprocess_documents(upload_folder)  # List[{"text":..., "metadata":...}]

    texts = [d["text"] for d in docs]
    metadatas = [d["metadata"] for d in docs]

    # 3. Instantiate embeddings
    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)

    # 4. Build a new FAISS index from scratch
    vectorstore = FAISS.from_texts(texts, embeddings, metadatas=metadatas)

    # 5. Save it locally under ./faiss_indexes/{user_id}/
    os.makedirs(index_folder, exist_ok=True)
    vectorstore.save_local(index_folder)

    return vectorstore

# -------------------
# Section 3: Load an existing FAISS index for a user (if it exists)
# -------------------

def load_vectorstore(user_id: str) -> FAISS:
    """
    Attempts to load ./faiss_indexes/{user_id}/. If that folder does not exist
    or is empty, returns None.
    """
    cwd = os.getcwd()
    index_folder = os.path.join(cwd, "faiss_indexes", user_id)

    # If the folder doesn’t exist or is empty, we have no index
    if not os.path.isdir(index_folder) or not os.listdir(index_folder):
        return None

    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    vectorstore = FAISS.load_local(
        index_folder,
        embeddings,
        allow_dangerous_deserialization=True
    )
    return vectorstore

# -------------------
# Section 4: Retrieval helpers (unchanged)
# -------------------

def retrieve_top_k(vectorstore: FAISS, query: str, k: int = 5):
    return vectorstore.similarity_search(query, k=k)

# -------------------
# Section 5: Generation via OpenAI Chat API (unchanged)
# -------------------

from openai import OpenAI
client = OpenAI(api_key=OPENAI_API_KEY)

# Simple in-memory chat history. If you want “sessionless” (i.e. clear on each restart),
# this is fine. If you need per‐user chat history, you’d persist it somewhere else.
chat_history: List[Dict[str, str]] = []

def generate_answer(question: str, docs: List[Dict]) -> str:
    context_blocks: List[str] = []
    for doc in docs:
        src = doc.metadata.get("source", "unknown")
        idx = doc.metadata.get("chunk_index", 0)
        block = f"[Source: {src} | Chunk: {idx}]\n{doc.page_content}"
        context_blocks.append(block)
    context_str = "\n\n".join(context_blocks)

    messages = [
        {"role": "system", "content": "You are a helpful assistant. Use the conversation history and provided context to answer."}
    ]
    messages.extend(chat_history)
    user_content = f"Context:\n{context_str}\n\nQuestion: {question}\nAnswer:"
    messages.append({"role": "user", "content": user_content})

    resp = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=512,
        temperature=0.0
    )
    answer = resp.choices[0].message.content.strip()

    # Append to in‐memory history (not persisted anywhere permanent)
    chat_history.append({"role": "user", "content": question})
    chat_history.append({"role": "assistant", "content": answer})
    return answer
