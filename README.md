# EduBot

*An Innovating text analysis with lightning-fast retrieval.*

[![License](https://img.shields.io/github/license/Vansh-Coder/RAG-Project?style=flat-square&logo=opensourceinitiative&logoColor=white&color=E92063)]()
[![Last Commit](https://img.shields.io/github/last-commit/Vansh-Coder/RAG-Project?style=flat-square&logo=git&logoColor=white&color=E92063)]()
[![Top Language](https://img.shields.io/github/languages/top/Vansh-Coder/RAG-Project?style=flat-square&color=E92063)]()
[![Language Count](https://img.shields.io/github/languages/count/Vansh-Coder/RAG-Project?style=flat-square&color=E92063)]()

*Built with the tools and technologies:*

![JSON](https://img.shields.io/badge/JSON-000000.svg?style=flat-square&logo=JSON&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837.svg?style=flat-square&logo=npm&logoColor=white)
![Autoprefixer](https://img.shields.io/badge/Autoprefixer-DD3735.svg?style=flat-square&logo=Autoprefixer&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-DD2C00.svg?style=flat-square&logo=Firebase&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A.svg?style=flat-square&logo=PostCSS&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E.svg?style=flat-square&logo=Prettier&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat-square&logo=JavaScript&logoColor=black)

![FastAPI](https://img.shields.io/badge/FastAPI-009688.svg?style=flat-square&logo=FastAPI&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C.svg?style=flat-square&logo=LangChain&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB.svg?style=flat-square&logo=React&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB.svg?style=flat-square&logo=Python&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991.svg?style=flat-square&logo=OpenAI&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-663399.svg?style=flat-square&logo=CSS&logoColor=white)

---

## Table of Contents

- [Overview](#overview)  
- [Features](#features)  
- [Architecture & Tech Stack](#architecture--tech-stack)  
- [Prerequisites](#prerequisites)  
- [Environment Variables](#environment-variables)  
- [Installation & Local Development](#installation--local-development)  
  - [Frontend (Next.js)](#frontend-nextjs)  
  - [Backend (FastAPI)](#backend-fastapi)  
- [Deployment](#deployment)  
  - [Frontend (Vercel)](#frontend-vercel)  
  - [Backend (Render)](#backend-render)  
- [Usage](#usage)  
- [Folder Structure](#folder-structure)  
- [Contributing](#contributing)  
- [License](#license)  
- [Acknowledgments](#acknowledgments)  
- [Contact](#contact)  

---

## Overview

RAG-Project is a Retrieval-Augmented Generation (RAG)–powered chatbot application. Users can upload documents (PDF, DOCX, TXT) as context, then chat with the AI to get answers based on those uploads and chat history. The frontend is built with Next.js & Tailwind CSS (hosted on Vercel). Authentication is managed via Firebase. The backend is a FastAPI service (Python) that handles document ingestion, embedding, vector storage, retrieval, and chat completion (hosted on Render).

---

## Features

- **User Authentication**  
  - Sign up and sign in with Firebase Authentication.  
- **Document Upload & Processing**  
  - Upload PDF/DOCX/TXT → extract text → chunk → embed → store in vector store.  
- **Retrieval-Augmented Chat**  
  - Retrieves top-K relevant chunks from uploaded documents + chat history → queries an LLM (OpenAI GPT).  
- **Real-Time Chat Interface**  
  - Tailwind-styled chat UI with streaming responses, history, and file management.  
- **Scalable Backend**  
  - FastAPI REST endpoints for document upload, embedding, retrieval, and chat.  

---

## Architecture & Tech Stack

### Frontend

- **Next.js** (React + SSR/SSG)  
- **Tailwind CSS** for styling  
- **Firebase Auth** (Email/password)  
- **Vercel** (hosting)  
- Axios / `fetch` for API calls  

### Backend

- **FastAPI** (Python) for REST APIs  
- **Python 3.9+**  
- OpenAI Embeddings & Chat API  
- **FAISS** (vector store)  
- **Render.com** (hosting & SSL)  
- **Firebase Admin SDK** (ID token verification)  

---

## Prerequisites

- **Node.js** ≥ 16 & **npm** (or Yarn)  
- **Python** ≥ 3.9 & **pip**  
- **Git** (to clone repo)  

### Required Accounts / API Keys

1. **Firebase** – create a project with Authentication enabled (Email & Google sign-in).  
2. **OpenAI** – obtain an API key (Model Turbo-3.5) for embeddings & chat/completion.

---

## Environment Variables

Create a `.env` in `/frontend` and a `.env` in `/backend` with the following:

### Frontend (`.env.local`)

```dotenv
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_BACKEND_URL=https://<your-backend-domain>.onrender.com
```

> **IMPORTANT:** Never commit real API keys. Use environment settings in Vercel/Render.

---

### Backend (`.env`)

```dotenv
FIREBASE_SERVICE_ACCOUNT_JSON=firebase-service-account-json_converted_to_string
OPENAI_API_KEY=sk-XXXXXXXXXXXXXXXXXXXX
```

Convert your the Firebase service-account JSON to string and store that in the `FIREBASE_SERVICE_ACCOUNT_JSON` environment varriable as shown above. Backend verifies and decodes Firebase ID Tokens using the Admin SDK.

---

## Installation & Local Development

First, clone the repository:

```bash
git clone https://github.com/Vansh-Coder/RAG-Project.git
cd RAG-Project
```

The repo structure:

```
RAG-Project/
├── frontend/   ← Next.js application
├── backend/    ← FastAPI service
├── LICENSE
└── README.md
```

### Frontend (Next.js)

1. Navigate to `/frontend`:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create `.env` (see [Environment Variables](#environment-variables)).

4. Start development server:

```bash
npm run dev
# or
yarn dev
```

- The app runs at `http://localhost:3000`.  
- You should see a Firebase-backed login/signup page.

5. Build for production (optional):

```bash
npm run build
npm start
```

### Backend (FastAPI)

1. Navigate to `/backend`:

```bash
cd ../backend
```

2. Create a virtual environment and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scriptsctivate
pip install --upgrade pip
pip install -r requirements.txt
```

3. Create `.env` (see [Environment Variables](#environment-variables)).

4. Convert your Firebase service-account JSON to string and set `FIREBASE_SERVICE_ACCOUNT_JSON` environment variable accordingly.

5. Initialize or restore your FAISS vector store:

- On first document upload, the vector store will be built in `./.vectorstore`.  

6. Run development server:

```bash
uvicorn app:app --reload
```

- FastAPI runs at `http://localhost:8000`.  
- Visit `http://localhost:8000/docs` for Swagger UI to test endpoints:  
  - `/upload`  
  - `/query` 
  - etc.

---

## Deployment

### Frontend (Vercel)

1. Push the `frontend/` folder to GitHub (or configure monorepo).  
2. In Vercel Dashboard:  
   - Link the repo (or frontend directory).  
   - Add environment variables (all `NEXT_PUBLIC_*` from `.env`).  
3. Build settings:  
   - Framework: Next.js  
   - Build command: `npm run build`  
   - Output directory: `.next`  

Every push to `main` triggers a deploy. You’ll get a public URL (e.g., `https://rag-project-blond.vercel.app`).

---

### Backend (Render)

1. Push the `backend/` folder to GitHub (or configure monorepo).  
2. In Render Dashboard:  
   - Create a new Web Service.  
   - Root directory: `backend/`.  
   - Environment:  
     - Runtime: Python 3  
     - Build command: `pip install -r requirements.txt`  
     - Start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`  
   - Add environment variables from `.env`:
     - `OPENAI_API_KEY`  
     - `FIREBASE_SERVICE_ACCOUNT_JSON`  

3. Modify CORS in `app.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict to your Vercel domain in production
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
```

Once built, Render provides a URL (e.g., `https://rag-backend.onrender.com`). Use this as `NEXT_PUBLIC_BACKEND_URL` environment variable for the frontend.

---

## Usage

1. Visit the Frontend URL (e.g., `https://rag-project-blond.vercel.app`).  
2. Sign up / Log in via Firebase.  
3. Upload Documents:  
   - Click “Upload” → select a PDF / DOCX / TXT file → wait for “Document processed successfully.”  
4. Chat with the AI:  
   - Type any query (e.g., “Explain chapter 2 of my PDF.”). The backend will:  
     1. Extract text chunks and generate embeddings.  
     2. Store embeddings in the FAISS index.  
     3. On each chat turn, retrieve relevant chunks + chat history.  
     4. Call the OpenAI Chat API for an answer.  
     5. Stream back the response in the chat window.  

5. Manage Documents:  
   - Delete or re-upload files as needed. Each new upload re-builds the vector store.  
6. Sign Out when done. Returning users’ uploaded documents remain available (vector store namespaced by UID).

---

## Folder Structure

```
RAG-Project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── chatWindow.jsx
│   │   │   ├── fileUpload.jsx
│   │   │   ├── navbar.jsx
│   │   │   └── ui/
│   │   │   │   ├── movingBorderButton.jsx
│   │   │   │   ├── spotlight.jsx
│   │   │   │   └── textGenerateEffect.jsx
│   │   ├── app/
│   │   │   ├── home/
│   │   │   │   ├── layout.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── login/
│   │   │   │   ├── layout.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── signup/
│   │   │   │   ├── layout.jsx
│   │   │   │   └── page.jsx
│   │   ├── page.jsx
│   │   ├── layout.jsx
│   │   ├── not-found.jsx
│   │   ├── globals.css
│   ├── firebaseConfig.js
│   ├── jsconfig.json
│   ├── next.config.mjs
│   ├── package.json
│   ├── postcss.config.js
│   ├── prettier.config.js
│   ├── tailwind.config.js
│   └── .env
├── backend/
│   ├── app.py
│   ├── rag_engine.py
│   ├── requirements.txt
│   └── .env
├── LICENSE
├── .gitignore
└── README.md
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.  
2. Clone your fork locally:  
   ```bash
   git clone https://github.com/your-username/RAG-Project.git
   ```  
3. Create a new branch:  
   ```bash
   git checkout -b feature/your-feature-name
   ```  
4. Make your changes & add tests if applicable.  
5. Commit your changes with a clear message:  
   ```bash
   git commit -m "Add feature X"
   ```  
6. Push to your fork:  
   ```bash
   git push origin feature/your-feature-name
   ```  
7. Open a Pull Request against `Vansh-Coder/RAG-Project`.  

Ensure code is formatted consistently:  
- Frontend: Prettier / ESLint  
- Backend: Black / Flake8 / Pytest

---

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## Acknowledgments
 
- Built with **FastAPI**, **Next.js**, **Tailwind CSS**, **Firebase**, **FAISS**, and **OpenAI** Embeddings & Chat APIs.
- Inspiration: Retrieval-Augmented Generation design patterns.

---

## Contact

**Author:** Vansh Gupta  
- GitHub: [github.com/Vansh-Coder](https://github.com/Vansh-Coder)
