# Agentic Data Sentinel AI Core (Python)

The engine behind the Secure AI Data Evaluator, responsible for orchestrating multi-agent workflows.

## 🚀 Technologies
- **FastAPI**: Modern, high-performance web framework.
- **CrewAI**: Multi-agent orchestration framework.
- **OpenAI GPT-4o**: The primary LLM used for intelligent analysis.
- **Pandas**: Efficient data processing and summary generation.

## 🛠️ Setup

1. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set your `OPENAI_API_KEY` in `.env`.

## 📡 API Endpoints
- `POST /analyze`: Submit a file for analysis. Returns a `job_id`.
- `GET /status/{job_id}`: Check the status and retrieve results of an analysis job.
- `GET /health`: Service health check.
