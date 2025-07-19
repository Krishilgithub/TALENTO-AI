import os
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnableSequence
from dotenv import load_dotenv
# Add imports for file handling
import pdfplumber
import docx
from typing import Optional

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
You are an extremely strict and critical ATS (Applicant Tracking System) expert. Analyze the following text for compatibility with ATS systems for a {job_role} role.

If the text does NOT appear to be a resume (e.g., it's too short, random text, or missing key sections), respond with:
{{
  "error": "The uploaded file does not appear to be a valid resume. Please upload a proper resume in PDF or DOCX format."
}}

Otherwise, provide a JSON output with:
- `score`: Integer from 0 to 100 (be strict; only perfect resumes get 90+)
- `feedback`: Object with:
    - `strengths`: List of strong points in the resume
    - `weaknesses`: List of weak points or missing elements
    - `tips`: List of actionable tips to improve the resume
    - `improvement_plan`: List of step-by-step actions to make the resume better

Analyze deeply:
- Penalize missing sections (Contact, Education, Experience, Skills, Projects, etc.)
- Penalize poor formatting, lack of keywords, or irrelevant content
- Check for keyword relevance, formatting, completeness, and overall professionalism

Example output:
{{
  "score": 72,
  "feedback": {{
    "strengths": ["Clear section headings", "Relevant skills listed"],
    "weaknesses": ["No project section", "Formatting is inconsistent", "Missing contact info"],
    "tips": ["Add a project section", "Include your email and phone number", "Use consistent bullet points"],
    "improvement_plan": [
      "Add a contact section with your email and phone number at the top.",
      "Create a 'Projects' section and describe 2-3 relevant projects.",
      "Review formatting for consistent use of bullet points and fonts."
    ]
  }}
}}

Resume text:
{resume_text}
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
        # Pre-check for very short or obviously non-resume text
        if not resume_text.strip() or len(resume_text.strip().split()) < 30:
            return {"error": "The uploaded file does not appear to be a valid resume. Please upload a proper resume in PDF or DOCX format."}
        result = ats_chain.invoke({"resume_text": resume_text, "job_role": job_role})
        # If the model returns an error field, propagate it
        if isinstance(result, dict) and "error" in result:
            return result
        return result
    except Exception as e:
        return {"error": f"Error calculating ATS score: {str(e)}"}

# --- New: Resume file text extraction ---
def extract_text_from_pdf(file_path: str) -> str:
    try:
        with pdfplumber.open(file_path) as pdf:
            text = "\n".join(page.extract_text() or '' for page in pdf.pages)
        return text
    except Exception as e:
        return ""

def extract_text_from_docx(file_path: str) -> str:
    try:
        doc = docx.Document(file_path)
        text = "\n".join([para.text for para in doc.paragraphs])
        return text
    except Exception as e:
        return ""

def extract_resume_text(file_path: str) -> Optional[str]:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext == ".docx":
        return extract_text_from_docx(file_path)
    else:
        return None

# --- New: Main function to process uploaded file ---
def process_resume_file(file_path: str, job_role: str = "Software Engineer") -> dict:
    resume_text = extract_resume_text(file_path)
    if resume_text is None or not resume_text.strip():
        return {"error": "Could not extract text from the uploaded resume. Supported formats: PDF, DOCX."}
    return calculate_ats_score(resume_text, job_role)

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