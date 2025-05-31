import os
from dotenv import load_dotenv
from rag_engine import preprocess_documents
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

load_dotenv()
OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]

corpus_folder = os.path.join(os.getcwd(), "corpus")

def build_save_index():
    docs = preprocess_documents(corpus_folder)
    texts = [d['text'] for d in docs]
    metadatas = [d['metadata'] for d in docs]

    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    vectorstore = FAISS.from_texts(texts, embeddings, metadatas=metadatas)
    vectorstore.save_local("faiss_index")
    print("FAISS index created and saved.")

if __name__ == "__main__":
    build_save_index()
