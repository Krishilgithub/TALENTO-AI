import os
from langchain_huggingface import HuggingFaceEmbeddings, HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from typing import TypedDict, Literal
from pydantic import BaseModel
from langchain_core.runnables import RunnableSequence
from dotenv import load_dotenv
import re

# Add imports for file handling
import pdfplumber
import docx
from typing import Optional

# Load environment variables
load_dotenv()

# Set up Hugging Face API key
hf_api_key = os.getenv("HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP")

# Initialize model with fallback
model = None
if hf_api_key:
    try:
        # Initialize Hugging Face Endpoint for conversational task
        llm = HuggingFaceEndpoint(
            model="mistralai/Mistral-7B-Instruct-v0.2",
            huggingfacehub_api_token=hf_api_key,
            temperature=0.5,
            max_new_tokens=1500,
        )
        model = ChatHuggingFace(llm=llm)
    except Exception as e:
        print(f"Warning: Failed to initialize Hugging Face Endpoint: {str(e)}")
        model = None
else:
    print("Warning: HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP not found. Using fallback mode.")

# Output parser
parser = StrOutputParser()

# Prompt template for ATS scoring
ats_scoring_template = """
You are an expert ATS (Applicant Tracking System) analyzer. Analyze the resume text for {job_role} position and provide:

1. **ATS Score** (0-100): Based on keyword matching, formatting, and relevance
2. **Keyword Analysis**: Identify relevant keywords found/missing
3. **Formatting Assessment**: Evaluate resume structure and readability
4. **Improvement Suggestions**: Specific recommendations for better ATS performance

Resume text: {resume_text}

Provide a detailed analysis with specific scores and actionable feedback.
"""

ats_scoring_prompt = PromptTemplate(
    input_variables=["resume_text", "job_role"],
    template=ats_scoring_template
)

# Create RunnableSequence only if model is available
ats_scoring_chain = None
if model:
    ats_scoring_chain = RunnableSequence(ats_scoring_prompt | model | parser)

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF file"""
    try:
        with pdfplumber.open(file_path) as pdf:
            text = "\n".join(page.extract_text() or '' for page in pdf.pages)
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def extract_text_from_docx(file_path: str) -> str:
    """Extract text from DOCX file"""
    try:
        doc = docx.Document(file_path)
        text = "\n".join([para.text for para in doc.paragraphs])
        return text
    except Exception as e:
        print(f"Error extracting text from DOCX: {e}")
        return ""

def extract_resume_text(file_path: str) -> Optional[str]:
    """Extract text from resume file (PDF or DOCX)"""
    try:
        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".pdf":
            return extract_text_from_pdf(file_path)
        elif ext == ".docx":
            return extract_text_from_docx(file_path)
        elif ext == ".doc":
            # For .doc files, we'll try to extract as much as possible
            return extract_text_from_docx(file_path)
        else:
            print(f"Unsupported file format: {ext}")
            return None
    except Exception as e:
        print(f"Error extracting resume text: {e}")
        return None

def process_resume_file(file_path: str, job_role: str = "Software Engineer") -> dict:
    """Process resume file and return ATS analysis"""
    try:
        resume_text = extract_resume_text(file_path)
        
        if not resume_text or not resume_text.strip():
            return {
                "error": "Could not extract text from the uploaded resume. Please ensure the file is not corrupted and is in PDF or DOCX format.",
                "status": "error"
            }
        
        if ats_scoring_chain:
            result = ats_scoring_chain.invoke({"resume_text": resume_text, "job_role": job_role})
            return {
                "analysis": result,
                "job_role": job_role,
                "status": "success"
            }
        else:
            # Fallback response when model is not available
            return {
                "analysis": f"""
**ATS Analysis for {job_role}**

**Note**: Full AI-powered analysis not available due to missing HuggingFace API token.

**Resume Text Extracted**: {len(resume_text)} characters
**Preview**: {resume_text[:200]}...

**Sample Analysis**:
- **ATS Score**: 75/100 (estimated)
- **Keywords Found**: Python, JavaScript, React, Node.js
- **Missing Keywords**: Docker, Kubernetes, AWS
- **Formatting**: Good structure, clear sections
- **Suggestions**: 
  - Add more specific technical keywords
  - Include quantifiable achievements
  - Optimize for ATS-friendly formatting

Please add HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP environment variable for full AI analysis.
                """,
                "job_role": job_role,
                "status": "fallback"
            }
    except Exception as e:
        return {
            "error": f"Error processing resume: {str(e)}",
            "status": "error"
        }

def calculate_ats_score(resume_text: str, job_role: str = "Software Engineer") -> dict:
    """Calculate ATS score for resume text"""
    try:
        if ats_scoring_chain:
            result = ats_scoring_chain.invoke({"resume_text": resume_text, "job_role": job_role})
            return {
                "score": result,
                "job_role": job_role,
                "status": "success"
            }
        else:
            # Fallback score calculation
            return {
                "score": "75/100 (estimated - full analysis requires API token)",
                "job_role": job_role,
                "status": "fallback"
            }
    except Exception as e:
        return {
            "error": f"Error calculating ATS score: {str(e)}",
            "status": "error"
        }

if __name__ == "__main__":
    result = process_resume_file("./data/sample_resume.pdf", "Software Engineer")
    print(result)