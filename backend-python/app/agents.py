from crewai import Agent, Task, Crew, Process
import os

# Placeholder for specific model config if needed
# os.environ["OPENAI_API_KEY"] = "YOUR_KEY_HERE"

def create_crew(data_summary: str, sample_data: str) -> Crew:
    """
    Creates and returns a CrewAI crew configured for data analysis.
    
    Args:
        data_summary (str): A string description of the dataset structure (columns, rows, etc).
        sample_data (str): A string containing a sample of the data.
    """

    # 1. Define Agents
    structure_analyst = Agent(
        role='Data Structure Analyst',
        goal='Analyze the structure and schema of the uploaded dataset',
        backstory="""You are an expert data engineer. Your job is to look at the raw structure 
        of data files (CSV, JSON, etc.) and identify the schema, data types, and potential 
        structural flaws (like missing headers or inconsistent formatting).""",
        verbose=True,
        allow_delegation=False
    )

    quality_auditor = Agent(
        role='Data Quality Auditor',
        goal='Identify potential quality issues and anomalies in the data',
        backstory="""You are a meticulous data quality specialist. You analyze data samples 
        to find missing values, outliers, potential PII leakage, or garbage data. 
        You rely on the Structure Analyst's initial findings.""",
        verbose=True,
        allow_delegation=False # Can set to True if we want them to talk, but for simple flow False is fine
    )

    # 2. Define Tasks
    analysis_task = Task(
        description=f"""
        Analyze the following dataset information:
        
        Data Summary:
        {data_summary}
        
        Sample Data:
        {sample_data}
        
        1. Identify the likely data type of each column.
        2. Check for missing values or potentially corrupt data based on the sample.
        3. Assess if there are any obvious structural issues.
        """,
        expected_output="A detailed structural analysis report outlining columns, types, and issues.",
        agent=structure_analyst
    )

    audit_task = Task(
        description=f"""
        Review the structural analysis and the sample data.
        
        1. Identify possible PII (Personally Identifiable Information).
        2. Flag any content that looks machine-generated or spammy.
        3. Provide a final 'Quality Score' from 0 to 100 with justification.
        """,
        expected_output="A quality audit report with PII flags and a final 0-100 score.",
        agent=quality_auditor,
        context=[analysis_task] # Depends on the first task
    )

    # 3. Create Crew
    crew = Crew(
        agents=[structure_analyst, quality_auditor],
        tasks=[analysis_task, audit_task],
        process=Process.sequential,
        verbose=True
    )

    return crew
