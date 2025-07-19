import os
from langchain_huggingface import HuggingFaceEmbeddings, HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.runnables import RunnableSequence
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up Hugging Face API key
hf_api_key = os.getenv("HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP")
if not hf_api_key:
    raise ValueError("HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP not found in .env file")

# Initialize Hugging Face Endpoint for conversational task
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

# Output parser
parser = StrOutputParser()

# Load and process resume PDF
def load_resume_text(pdf_path: str) -> str:
    try:
        loader = PyPDFLoader(pdf_path)
        documents = loader.load()
        resume_text = " ".join(doc.page_content for doc in documents)
        if not resume_text.strip():
            raise ValueError("No text extracted from resume PDF")
        return resume_text
    except Exception as e:
        raise ValueError(f"Error loading resume PDF: {str(e)}")

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

# Create RunnableSequence (replacing LLMChain)
resume_analysis_chain = RunnableSequence(resume_analysis_prompt | model | parser)

# Function to analyze resume
def analyze_resume(pdf_path: str, job_role: str = "Software Engineer") -> str:
    try:
        resume_text = load_resume_text(pdf_path)
        result = resume_analysis_chain.invoke({"resume_text": resume_text, "job_role": job_role})
        return result
    except Exception as e:
        return f"Error analyzing resume: {str(e)} 😵"

# Example usage
if __name__ == "__main__":
    pdf_path = "./data/Krishil Agrawal Resume - ML.pdf"
    result = analyze_resume(pdf_path, "Machine Learning Engineer")
    print(result)