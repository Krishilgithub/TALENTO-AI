import os
from langchain_huggingface import HuggingFaceEmbeddings, HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from typing import TypedDict, Literal, Optional
from pydantic import BaseModel
from langchain_core.runnables import RunnableSequence
from dotenv import load_dotenv
import pdfplumber   #type: ignore
import docx #type: ignore

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

# Prompt template for resume analysis
resume_analysis_template = """
You are an expert career coach analyzing a resume. Given the following resume text:

{resume_text}

Perform the following tasks:
1. **Extract Key Components**: Identify the main sections (e.g., Summary, Education, Experience, Skills) and list key details (e.g., job roles, skills, achievements).
2. **Provide Feedback**: Evaluate the resume's strengths and weaknesses. Consider clarity, relevance, formatting, keyword usage, and impact for a job in {job_role}.
3. **Suggest Improvements**: Recommend specific changes to improve the resume, such as adding quantifiable achievements, optimizing keywords, or restructuring sections.

Format the output as follows:
**Key Components**:
- [Component 1]: [Details]
- [Component 2]: [Details]

**Feedback**:
- Strengths: [List strengths]
- Weaknesses: [List weaknesses]

**Suggestions**:
- [Suggestion 1]
- [Suggestion 2]
"""

resume_analysis_prompt = PromptTemplate(
    input_variables=["resume_text", "job_role"],
    template=resume_analysis_template
)

# Create RunnableSequence only if model is available
resume_analysis_chain = None
if model:
    resume_analysis_chain = RunnableSequence(resume_analysis_prompt | model | parser)

# Function to analyze resume
def analyze_resume(file_path: str, job_role: str = "Software Engineer") -> str:
    try:
        resume_text = extract_resume_text(file_path)
        
        if not resume_text or not resume_text.strip():
            return f"Error: Could not extract text from the uploaded resume. Please ensure the file is not corrupted and is in PDF or DOCX format."
        
        if resume_analysis_chain:
            result = resume_analysis_chain.invoke({"resume_text": resume_text, "job_role": job_role})
            return result
        else:
            # Fallback response when model is not available
            return f"""
**Resume Analysis for {job_role}**

**Note**: Full AI-powered analysis not available due to missing HuggingFace API token.

**Resume Text Extracted**: {len(resume_text)} characters
**Preview**: {resume_text[:200]}...

**Sample Analysis**:
- **Key Components**: Resume text was successfully extracted and processed
- **Strengths**: Resume text was successfully extracted and processed
- **Weaknesses**: Full AI-powered analysis not available due to missing API token
- **Suggestions**: 
  - Please add HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP environment variable for full analysis
  - Resume text length: {len(resume_text)} characters
  - Extracted content preview: {resume_text[:200]}...
            """
    except Exception as e:
        return f"Error analyzing resume: {str(e)} 😵"

# Example usage
if __name__ == "__main__":
    pdf_path = "./data/Krishil Agrawal Resume - ML.pdf"
    result = analyze_resume(pdf_path, "Machine Learning Engineer")
    print(result)