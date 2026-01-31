from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import pandas as pd
import io
from .agents import create_crew

app = FastAPI(title="AIDA Lite AI Service")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisResult(BaseModel):
    filename: str
    summary: str
    quality_score: str = "N/A" # Extracted from text or just return full text for now
    full_report: str

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "python-ai-core"}

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_data(file: UploadFile = File(...)):
    """
    Uploads a file (CSV/JSON), analyzes structure, and runs CrewAI agents.
    """
    try:
        contents = await file.read()
        
        # Simple detection based on extension
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith('.json'):
            df = pd.read_json(io.BytesIO(contents))
        else:
            # Fallback for text files, just treat as raw text wrapped in one column
            df = pd.DataFrame({'content': [contents.decode('utf-8')]})

        # Prepare context for the agents
        data_summary = f"Columns: {list(df.columns)}\nTypes:\n{df.dtypes.to_string()}\nShape: {df.shape}"
        sample_data = df.head(5).to_string()

        # Initialize Crew
        crew = create_crew(data_summary, sample_data)
        
        # execution
        # Note: In a real app, this should be a background task (Celery/BullMQ)
        result = crew.kickoff()
        
        return {
            "filename": file.filename,
            "summary": f"Analyzed {df.shape[0]} rows and {df.shape[1]} columns.",
            "quality_score": "See Full Report", 
            "full_report": str(result)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
