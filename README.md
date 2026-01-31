# Secure AI Data Evaluator (AIDA Lite)

A professional-grade, specialized AI data evaluation platform designed to demonstrate modern software architecture, multi-agent AI orchestration, and DevSecOps best practices.

## 🚀 Overview

AIDA Lite is a 3-tier microservices application that provides automated structural and security audits for datasets (CSV/JSON). It leverages **CrewAI** with **OpenAI GPT-4o** to orchestrate specialized agents that analyze data health, identify PII risks, and evaluate schema consistency.

## 🏗️ Architecture

The project follows a robust, decoupled architecture:

1.  **React Frontend (Vite + TailwindCSS)**: A high-performance, premium dashboard with smooth transitions (Framer Motion) and real-time status polling.
2.  **Node.js API Gateway (Express)**: The central ingress point. Handles file buffers (Multer), enforces security headers (Helmet), and proxies traffic to the AI core.
3.  **Python AI Core (FastAPI)**: Asynchronous service managing long-running AI jobs. Orchestrates a **Crew** of agents to analyze data headlessly.

## 🤖 Multi-Agent AI System

Powered by **CrewAI**, the system employs a sequential process:
- **Structure Analyst**: Validates schema, data types, and primary key candidates.
- **Security & Quality Auditor**: Identifies PII patterns (emails, keys) and generates a data health score.

## 🛡️ Security & DevSecOps
- **SAST**: Automated Python code analysis via Bandit.
- **SCA**: Dependency vulnerability scanning via pip-audit/npm-audit.
- **Node Security**: Implementation of Helmet, CORS, and rate-limiting best practices.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- OpenAI API Key

### Setup
1. Clone the repository.
2. Run the automated setup script:
   ```bash
   chmod +x setup_project.sh
   ./setup_project.sh
   ```
3. Set your environment variables in `backend-python/.env`:
   ```text
   OPENAI_API_KEY=sk-...
   ```
4. Start the services:
   - **Frontend**: `cd frontend && npm run dev`
   - **Node Gateway**: `cd backend-node && node src/index.js`
   - **Python Core**: `cd backend-python && venv/bin/uvicorn app.main:app --reload`
