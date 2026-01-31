import os

from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import pandas as pd
import io
import uuid
import os
import asyncio
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

        # Check for Mock Mode
        if os.getenv("MOCK_AI", "false").lower() == "true":
            jobs[job_id]["status"] = "Simulating AI analysis (Mock Mode)..."
            await asyncio.sleep(2) 
            
            issues = []
            pii_found = False
            null_count = int(df.isnull().sum().sum())
            
            # Simple heuristic detection for dynamic report
            for col in df.columns:
                unique_types = set(type(x) for x in df[col] if pd.notnull(x))
                if len(unique_types) > 1:
                    issues.append(f"Mixed data types in '{col}': {unique_types}")
                
                if df[col].dtype == object:
                    content_str = df[col].astype(str).str.cat(sep=' ')
                    if any(key in content_str.upper() for key in ["SSN", "123-"]):
                        pii_found = True
                        issues.append(f"PII Risk (SSN-like pattern) detected in '{col}'.")
            
            if null_count > 0:
                issues.append(f"Found {null_count} missing (null) values.")

            quality_val = max(10 - (len(issues) * 1.5), 1)
            quality_score = f"{quality_val} / 10"
            
            issues_list = "\n".join([f"  - {iss}" for iss in issues]) if issues else "  - No major quality issues found."
            struct_list = "\n".join([f"- {iss}" for iss in issues if "type" in iss.lower()]) or "- Data types appear consistent (Mock Analysis)."

            # Prepare structured report for modern UI
            structured_report = [
                {
                    "section": "🏗️ Structural Audit",
                    "data": [
                        {"metric": "Data Shape", "value": f"{df.shape[0]} rows x {df.shape[1]} columns"},
                        {"metric": "Type Integrity", "value": "⚠️ Inconsistent" if "Mixed" in struct_list else "✅ Consistent"},
                        {"metric": "Primary Key", "value": f"'{df.columns[0]}' candidate"}
                    ]
                },
                {
                    "section": "🛡️ Security & Quality",
                    "data": [
                        {"metric": "PII Risk Level", "value": "🚨 HIGH" if pii_found else "✅ LOW"},
                        {"metric": "Health Score", "value": quality_score},
                        {"metric": "Data Density", "value": f"{((df.notnull().sum().sum()) / (df.size) * 100):.1f}%"}
                    ]
                }
            ]

            # Dynamic Issues section
            issue_rows = [{"metric": "Anomaly", "value": iss} for iss in issues]
            structured_report.append({
                "section": "🚩 Detected Issues",
                "data": issue_rows if issue_rows else [{"metric": "Status", "value": "No issues found"}]
            })

            # Cleanup section
            structured_report.append({
                "section": "🧹 Cleanup Workflow",
                "data": [
                    {"metric": "Redaction", "value": f"Mask patterns in '{df.columns[-1]}'"},
                    {"metric": "Normalization", "value": f"Fix types in '{df.columns[0]}'"},
                    {"metric": "Imputation", "value": f"Handle {null_count} null values"}
                ]
            })

            result = "Structured report generated." 
            
        else:
            crew = create_crew(data_summary, sample_data)
            jobs[job_id]["status"] = "Agents are analyzing structure and quality..."
            result = str(crew.kickoff())
            quality_score = "8.5 / 10" 
            structured_report = None # Fallback to markdown for live AI
        
        jobs[job_id]["status"] = "completed"
        jobs[job_id]["result"] = {
            "filename": filename,
            "summary": f"Analyzed {df.shape[0]} rows and {df.shape[1]} columns.",
            "quality_score": quality_score, 
            "full_report": result,
            "structured_report": structured_report
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
