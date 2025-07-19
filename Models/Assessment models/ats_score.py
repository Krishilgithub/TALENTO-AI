import os
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnableSequence
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up Hugging Face API key
hf_api_key = os.getenv("HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP")
if not hf_api_key:
    raise ValueError("HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP not found in .env file")

# Initialize Hugging Face Endpoint
try:
    llm = HuggingFaceEndpoint(
        model="mistralai/Mistral-7B-Instruct-v0.2",
        huggingfacehub_api_token=hf_api_key,
        temperature=0.5,
        max_new_tokens=1500,
    )
    model = ChatHuggingFace(llm=llm)
except Exception as e:
    raise ValueError(f"Failed to initialize Hugging Face Endpoint: {str(e)}")

# Output parser for JSON
parser = JsonOutputParser()

# Prompt template for ATS score
ats_template = """
You are an ATS (Applicant Tracking System) expert. Analyze the following resume text for compatibility with ATS systems for a {job_role} role:

{resume_text}

Evaluate based on:
- Keyword relevance (e.g., skills, tools, experience matching job role)
- Formatting (e.g., clear sections, no complex graphics)
- Completeness (e.g., contact info, education, experience)

Provide a JSON output with:
- `score`: Integer from 0 to 100
- `feedback`: Object with `strengths` (list), `weaknesses` (list), and `tips` (list)

```json
{{
    "score": 0,
    "feedback": {{
        "strengths": [],
        "weaknesses": [],
        "tips": []
    }}
}}
"""
ats_prompt = PromptTemplate(
    input_variables=["resume_text", "job_role"],
    template=ats_template
)

# Create RunnableSequence
ats_chain = RunnableSequence(ats_prompt | model | parser)

# Function to calculate ATS score
def calculate_ats_score(resume_text: str, job_role: str = "Software Engineer") -> dict:
    try:
        if not resume_text.strip():
            return {"error": "Resume text is empty"}
        result = ats_chain.invoke({"resume_text": resume_text, "job_role": job_role})
        return result
    except Exception as e:
        return {"error": f"Error calculating ATS score: {str(e)}"}

# Example usage
if __name__ == "__main__":
    sample_resume = """
    Krishil Agrawal
    Summary: Aspiring Software Engineer with experience in Python and React.
    Education: B.Tech in Computer Science, Charusat University, 2023-2027
    Experience: Intern at Tech Corp, developed web apps using React and Node.js.
    Skills: Python, JavaScript, React, Node.js, SQL
    """
    result = calculate_ats_score(sample_resume, "Software Engineer")
    import json
    print(json.dumps(result, indent=2))