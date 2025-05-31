# """
# RAG-based Chatbot Script with Session Memory
# Dependencies:
#   pip install langchain-openai faiss-cpu python-docx PyPDF2 openai
# """
# import os
# import sys
# import re
# from typing import List, Dict

# # Section 0: Chat History / Session Memory
# # ----------------------------------------
# # In-memory store of past messages (role: 'user' or 'assistant')
# chat_history: List[Dict[str, str]] = []

# # Section 1: Preprocessing and Cleaning
# # -------------------------------------
# from docx import Document
# import PyPDF2

# def load_text(file_path: str) -> str:
#     ext = os.path.splitext(file_path)[1].lower()
#     if ext == '.docx':
#         doc = Document(file_path)
#         text = "\n".join(p.text for p in doc.paragraphs)
#     elif ext == '.pdf':
#         reader = PyPDF2.PdfReader(file_path)
#         text = ''.join((page.extract_text() or '') + '\n' for page in reader.pages)
#     elif ext == '.txt':
#         with open(file_path, 'r', encoding='utf-8') as f:
#             text = f.read()
#     else:
#         raise ValueError(f"Unsupported file type: {ext}")
#     return text


# def clean_text(text: str) -> str:
#     return re.sub(r'\s+', ' ', text).strip()


# def preprocess_documents(folder: str) -> List[Dict]:
#     if not os.path.isdir(folder):
#         raise FileNotFoundError(f"Corpus folder not found: {folder}")
#     files = [os.path.join(folder, f) for f in os.listdir(folder)
#              if os.path.splitext(f)[1].lower() in {'.docx', '.pdf', '.txt'}]
#     if not files:
#         raise ValueError(f"No supported files (.docx, .pdf, .txt) in folder: {folder}")

#     from langchain.text_splitter import RecursiveCharacterTextSplitter
#     splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
#     all_chunks: List[Dict] = []

#     for fp in files:
#         raw = load_text(fp)
#         cleaned = clean_text(raw)
#         chunks = splitter.split_text(cleaned)
#         for i, chunk in enumerate(chunks):
#             all_chunks.append({
#                 'text': chunk,
#                 'metadata': {'source': os.path.basename(fp), 'chunk_index': i}
#             })
#     return all_chunks

# # Section 2: Embedding & Indexing
# # --------------------------------
# from langchain_openai import OpenAIEmbeddings
# from langchain_community.vectorstores import FAISS

# corpus_folder = os.path.join(os.getcwd(), 'corpus')

# try:
#     docs = preprocess_documents(corpus_folder)
# except Exception as e:
#     print(f"Error loading documents: {e}", file=sys.stderr); sys.exit(1)
# texts = [d['text'] for d in docs]
# metadatas = [d['metadata'] for d in docs]
# if not texts:
#     print(f"No text chunks from {corpus_folder}", file=sys.stderr); sys.exit(1)

# embeddings = OpenAIEmbeddings(openai_api_key=kkej)
# try:
#     vectorstore = FAISS.from_texts(texts, embeddings, metadatas=metadatas)
# except Exception as e:
#     print(f"Error creating FAISS index: {e}", file=sys.stderr); sys.exit(1)
# vectorstore.save_local('faiss_index')

# # Section 3: Retrieval
# # ---------------------
# def retrieve_top_k(query: str, k: int = 5):
#     return vectorstore.similarity_search(query, k=k)

# # Section 4: Generation via OpenAI Chat API (v1.x)
# # -------------------------------------------------
# from openai import OpenAI
# client = OpenAI(api_key=kkej)

# def generate_answer(question: str, docs: List[Dict]) -> str:
#     # Build context from retrieved docs
#     context_blocks: List[str] = []
#     for doc in docs:
#         src = doc.metadata.get('source', 'unknown')
#         idx = doc.metadata.get('chunk_index', 0)
#         block = f"[Source: {src} | Chunk: {idx}]\n{doc.page_content}"
#         context_blocks.append(block)
#     context_str = "\n\n".join(context_blocks)

#     # Combine system prompt, chat history, and new query
#     messages = [
#         {'role': 'system', 'content': 'You are a helpful assistant. Use the conversation history and provided context to answer.'}
#     ]
#     messages.extend(chat_history)
#     # Inject retrieved context as part of the user message
#     user_content = f"Context:\n{context_str}\n\nQuestion: {question}\nAnswer:"
#     messages.append({'role': 'user', 'content': user_content})

#     # Call the ChatCompletion API
#     resp = client.chat.completions.create(
#         model='gpt-3.5-turbo',
#         messages=messages,
#         max_tokens=512,
#         temperature=0.0
#     )
#     answer = resp.choices[0].message.content.strip()

#     # Update chat history with the user query and assistant answer
#     chat_history.append({'role': 'user', 'content': question})
#     chat_history.append({'role': 'assistant', 'content': answer})
#     return answer

# # Section 5: Main Chat Loop
# # -------------------------
# if __name__ == '__main__':
#     print("RAG Chatbot ready. Type 'exit' to quit.")
#     while True:
#         q = input("You: ")
#         if q.lower() in {'exit', 'quit'}:
#             print("Goodbye!")
#             break
#         docs = retrieve_top_k(q, k=5)
#         ans = generate_answer(q, docs)
#         print(f"Bot: {ans}\n")

# rag_engine.py

import os
import re
from typing import List, Dict
from dotenv import load_dotenv

from docx import Document
import PyPDF2

from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

# Your OpenAI API key here or load from env variables
load_dotenv()
OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]

# -------------------
# Section 1: Preprocessing and Cleaning
# -------------------

def load_text(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.docx':
        doc = Document(file_path)
        text = "\n".join(p.text for p in doc.paragraphs)
    elif ext == '.pdf':
        reader = PyPDF2.PdfReader(file_path)
        text = ''.join((page.extract_text() or '') + '\n' for page in reader.pages)
    elif ext == '.txt':
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()
    else:
        raise ValueError(f"Unsupported file type: {ext}")
    return text

def clean_text(text: str) -> str:
    return re.sub(r'\s+', ' ', text).strip()

def preprocess_documents(folder: str) -> List[Dict]:
    if not os.path.isdir(folder):
        raise FileNotFoundError(f"Corpus folder not found: {folder}")
    files = [os.path.join(folder, f) for f in os.listdir(folder)
             if os.path.splitext(f)[1].lower() in {'.docx', '.pdf', '.txt'}]
    if not files:
        raise ValueError(f"No supported files (.docx, .pdf, .txt) in folder: {folder}")

    from langchain.text_splitter import RecursiveCharacterTextSplitter
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    all_chunks: List[Dict] = []

    for fp in files:
        raw = load_text(fp)
        cleaned = clean_text(raw)
        chunks = splitter.split_text(cleaned)
        for i, chunk in enumerate(chunks):
            all_chunks.append({
                'text': chunk,
                'metadata': {'source': os.path.basename(fp), 'chunk_index': i}
            })
    return all_chunks

# -------------------
# Section 2 & 3: Embedding, Indexing & Retrieval helpers
# -------------------

def load_vectorstore():
    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    vectorstore = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    return vectorstore

def retrieve_top_k(vectorstore, query: str, k: int = 5):
    return vectorstore.similarity_search(query, k=k)

# -------------------
# Section 4: Generation via OpenAI Chat API
# -------------------

from openai import OpenAI
client = OpenAI(api_key=OPENAI_API_KEY)

# In-memory chat history
chat_history: List[Dict[str, str]] = []

def generate_answer(question: str, docs: List[Dict]) -> str:
    context_blocks: List[str] = []
    for doc in docs:
        src = doc.metadata.get('source', 'unknown')
        idx = doc.metadata.get('chunk_index', 0)
        block = f"[Source: {src} | Chunk: {idx}]\n{doc.page_content}"
        context_blocks.append(block)
    context_str = "\n\n".join(context_blocks)

    messages = [
        {'role': 'system', 'content': 'You are a helpful assistant. Use the conversation history and provided context to answer.'}
    ]
    messages.extend(chat_history)
    user_content = f"Context:\n{context_str}\n\nQuestion: {question}\nAnswer:"
    messages.append({'role': 'user', 'content': user_content})

    resp = client.chat.completions.create(
        model='gpt-3.5-turbo',
        messages=messages,
        max_tokens=512,
        temperature=0.0
    )
    answer = resp.choices[0].message.content.strip()

    chat_history.append({'role': 'user', 'content': question})
    chat_history.append({'role': 'assistant', 'content': answer})
    return answer
