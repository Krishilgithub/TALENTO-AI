import os
from langchain_huggingface import HuggingFaceEmbeddings, HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from typing import TypedDict, Literal
from pydantic import BaseModel
from langchain_core.runnables import RunnableSequence
from dotenv import load_dotenv

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

# Prompt template for aptitude assessment
aptitude_assessment_template = """
You are an expert aptitude test creator. Generate {num_questions} multiple-choice aptitude questions for {job_role} position.

Cover these areas:
1. Logical reasoning
2. Numerical ability
3. Verbal reasoning
4. Abstract thinking
5. Problem-solving
6. Critical thinking

Format each question as:
Q{number}. [Question text]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct Answer: [A/B/C/D]
Explanation: [Brief explanation]

Make questions relevant to {job_role} and varying difficulty levels.
"""

aptitude_assessment_prompt = PromptTemplate(
    input_variables=["job_role", "num_questions"],
    template=aptitude_assessment_template
)

# Create RunnableSequence only if model is available
aptitude_assessment_chain = None
if model:
    aptitude_assessment_chain = RunnableSequence(aptitude_assessment_prompt | model | parser)

def generate_aptitude_mcqs(job_role: str = "Software Engineer", num_questions: int = 10) -> dict:
    try:
        if aptitude_assessment_chain:
            result = aptitude_assessment_chain.invoke({"job_role": job_role, "num_questions": num_questions})
            return {
                "questions": result,
                "job_role": job_role,
                "total_questions": num_questions,
                "status": "success"
            }
        else:
            # Fallback response when model is not available
            return {
                "questions": f"""
**Aptitude Assessment for {job_role}**

**Note**: Full AI-powered assessment not available due to missing HuggingFace API token.

**Sample Questions** (Generated without AI):
1. If a train travels 120 km in 2 hours, what is its speed in km/h?
   A) 40 B) 60 C) 80 D) 100
   Correct Answer: B
   Explanation: Speed = Distance/Time = 120/2 = 60 km/h

2. Which number comes next: 2, 4, 8, 16, __?
   A) 24 B) 32 C) 30 D) 28
   Correct Answer: B
   Explanation: Each number is multiplied by 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32

Please add HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP environment variable for full AI-generated assessment.
                """,
                "job_role": job_role,
                "total_questions": num_questions,
                "status": "fallback"
            }
    except Exception as e:
        return {
            "error": f"Error generating aptitude assessment: {str(e)}",
            "status": "error"
        }

if __name__ == "__main__":
    result = generate_aptitude_mcqs("Software Engineer", 5)
    print(result)