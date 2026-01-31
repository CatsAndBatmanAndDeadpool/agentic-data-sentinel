from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import pandas as pd
import io
import uuid
import os
from .agents import create_crew

app = FastAPI(title="AIDA Lite AI Service")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for job status
# In a real app, use Redis or a database
jobs = {}

class AnalysisJob(BaseModel):
    job_id: str
    status: str
    filename: str
    result: dict = None
    error: str = None

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "python-ai-core"}

async def run_analysis(job_id: str, filename: str, contents: bytes):
    try:
        jobs[job_id]["status"] = "Processing file..."
        # Detection
        if filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        elif filename.endswith('.json'):
            df = pd.read_json(io.BytesIO(contents))
        else:
            df = pd.DataFrame({'content': [contents.decode('utf-8', errors='ignore')]})

        jobs[job_id]["status"] = "Initializing AI Agents..."
        data_summary = f"Columns: {list(df.columns)}\nTypes:\n{df.dtypes.to_string()}\nShape: {df.shape}"
        sample_data = df.head(5).to_string()

        crew = create_crew(data_summary, sample_data)
        
        jobs[job_id]["status"] = "Agents are analyzing structure and quality..."
        result = crew.kickoff()
        
        jobs[job_id]["status"] = "completed"
        jobs[job_id]["result"] = {
            "filename": filename,
            "summary": f"Analyzed {df.shape[0]} rows and {df.shape[1]} columns.",
            "quality_score": "See Full Report", 
            "full_report": str(result)
        }
    except Exception as e:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = str(e)

@app.post("/analyze")
async def analyze_data(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    job_id = str(uuid.uuid4())
    contents = await file.read()
    
    jobs[job_id] = {
        "job_id": job_id,
        "status": "queued",
        "filename": file.filename,
        "result": None,
        "error": None
    }
    
    background_tasks.add_task(run_analysis, job_id, file.filename, contents)
    
    return {"job_id": job_id}

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]

if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    uvicorn.run("app.main:app", host=host, port=8000, reload=True)
