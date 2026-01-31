import os
from crewai import Agent, Task, Crew, Process
from langchain_google_genai import ChatGoogleGenerativeAI

# NO OPENAI_API_KEY SET HERE

def test():
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash-latest",
        google_api_key=os.getenv("GEMINI_API_KEY")
    )

    agent = Agent(
        role='Tester',
        goal='Say hi',
        backstory='Testing',
        llm=llm,
        verbose=True,
        allow_delegation=False
    )

    task = Task(
        description='Say hi to the user.',
        agent=agent,
        expected_output='Greetings.'
    )

    crew = Crew(
        agents=[agent],
        tasks=[task],
        process=Process.sequential,
        verbose=True
    )

    result = crew.kickoff()
    print(f"RESULT: {result}")

if __name__ == "__main__":
    test()
