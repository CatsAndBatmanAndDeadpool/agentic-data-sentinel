from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI
import os

def create_crew(data_summary: str, sample_data: str):
    # Initialize OpenAI LLM
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.2,
        openai_api_key=os.getenv("OPENAI_API_KEY")
    )

    # Agent 1: Structure Analyst
    structure_analyst = Agent(
        role='Data Structure Analyst',
        goal='Analyze the schema and structure of the provided dataset to identify potential inconsistencies or optimization opportunities.',
        backstory="""You are an expert data engineer. You specialize in understanding data relationships, 
        identifying schema issues, and suggesting target architectures for data pipelines.""",
        llm=llm,
        verbose=True,
        allow_delegation=False
    )

    # Agent 2: Security & Quality Auditor
    quality_auditor = Agent(
        role='Data Quality & Security Auditor',
        goal='Identify PII, sensitive information, missing values, and potential data quality issues in the dataset.',
        backstory="""You are a Senior DevSecOps Engineer with a focus on data privacy (GDPR/SOC2). 
        You have a sharp eye for identifying sensitive patterns like emails, phone numbers, or credit card numbers, 
        as well as assessing the completeness and accuracy of the data.""",
        llm=llm,
        verbose=True,
        allow_delegation=False
    )

    # Task 1: Structural Analysis
    task_structure = Task(
        description=f"""
        Analyze the following data summary and sample to evaluate the structure:
        SUMMARY:
        {data_summary}
        
        SAMPLE:
        {sample_data}
        
        Provide a report on:
        1. Column naming conventions.
        2. Data type appropriateness.
        3. Potential primary key candidates.
        4. Any structural anomalies.
        """,
        agent=structure_analyst,
        expected_output="A detailed structural audit report in markdown format."
    )

    # Task 2: Quality & Security Audit
    task_quality = Task(
        description=f"""
        Evaluate the data summary and sample for quality and security risks:
        SUMMARY:
        {data_summary}
        
        SAMPLE:
        {sample_data}
        
        Identify:
        1. Potential PII (Personally Identifiable Information) present.
        2. Percentage of missing values (estimate from summary).
        3. Outliers or inconsistent formatting.
        4. Overall security score from 1-10.
        """,
        agent=quality_auditor,
        expected_output="A comprehensive quality and security assessment report in markdown format."
    )

    # Instantiate the Crew
    crew = Crew(
        agents=[structure_analyst, quality_auditor],
        tasks=[task_structure, task_quality],
        process=Process.sequential,
        verbose=True,
        memory=False # Keep memory off to avoid embedding dependency issues initially
    )

    return crew
