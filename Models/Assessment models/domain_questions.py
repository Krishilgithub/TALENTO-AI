import os
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnableSequence
from langchain_community.document_loaders import PyPDFLoader
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up Hugging Face API key
hf_api_key = os.getenv("HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP")
if not hf_api_key:
    raise ValueError("HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP not found in .env file 😞")

# Initialize Hugging Face Endpoint
try:
    llm = HuggingFaceEndpoint(
        model="mistralai/Mistral-7B-Instruct-v0.2",
        huggingfacehub_api_token=hf_api_key,
        temperature=0.5,
        max_new_tokens=2000,
        endpoint_url="https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"
    )
    model = ChatHuggingFace(llm=llm)
except Exception as e:
    raise ValueError(f"Failed to initialize Hugging Face Endpoint: {str(e)} 😵")

# Output parser for JSON
parser = JsonOutputParser()

# Load resume text
def load_resume_text(input_data: str, is_pdf: bool = False) -> str:
    try:
        if is_pdf:
            loader = PyPDFLoader(input_data)
            documents = loader.load()
            resume_text = " ".join(doc.page_content for doc in documents)
        else:
            resume_text = input_data
        if not resume_text.strip():
            raise ValueError("No text extracted from resume 😞")
        return resume_text
    except Exception as e:
        raise ValueError(f"Error loading resume: {str(e)} 😵")

# Prompt template for domain questions
domain_template = """
You are an expert in technical interviews. Analyze the following resume text to extract technical skills:

{resume_text}

Generate 20 domain-specific questions for a {job_role} role based on the extracted skills. Each question should test technical knowledge relevant to the skills. Format the output as a JSON array:

```json
[
    {{
        "question": "Question text",
        "type": "technical",
        "skill": "Relevant skill"
    }},
    ...
]
"""
domain_prompt = PromptTemplate(
    input_variables=["resume_text", "job_role"],
    template=domain_template
)

# Create RunnableSequence
domain_chain = RunnableSequence(domain_prompt | model | parser)

# Function to generate domain questions
def generate_domain_questions(input_data: str, job_role: str = "Software Engineer", is_pdf: bool = False) -> dict:
    try:
        resume_text = load_resume_text(input_data, is_pdf)
        result = domain_chain.invoke({"resume_text": resume_text, "job_role": job_role})
        return result
    except Exception as e:
        return {"error": f"Error generating questions: {str(e)} 😵"}

# Example usage
if __name__ == "__main__":
    sample_resume = """
    Krishil Agrawal
    Summary: Aspiring Software Engineer with experience in Python and React.
    Education: B.Tech in Computer Science, Charusat University, 2023-2027
    Experience: Intern at Tech Corp, developed web apps using React and Node.js.
    Skills: Python, JavaScript, React, Node.js, SQL
    """
    result = generate_domain_questions(sample_resume, "Software Engineer", is_pdf=False)
    import json
    print(json.dumps(result, indent=2))