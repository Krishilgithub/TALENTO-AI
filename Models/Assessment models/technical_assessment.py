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
hf_api_key = os.getenv('HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP')

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

# Prompt template for technical assessment
technical_assessment_template = """
You are an expert technical interviewer creating a comprehensive technical assessment for {job_role} position.

Create {num_questions} multiple-choice questions covering the following areas:
1. Programming fundamentals
2. Data structures and algorithms
3. System design concepts
4. Database knowledge
5. Web technologies (if applicable)
6. Problem-solving scenarios

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

technical_assessment_prompt = PromptTemplate(
    input_variables=["job_role", "num_questions"],
    template=technical_assessment_template
)

# Create RunnableSequence only if model is available
technical_assessment_chain = None
if model:
    technical_assessment_chain = RunnableSequence(technical_assessment_prompt | model | parser)

def generate_technical_mcqs(job_role: str = "Software Engineer", num_questions: int = 10) -> dict:
    try:
        if technical_assessment_chain:
            result = technical_assessment_chain.invoke({"job_role": job_role, "num_questions": num_questions})
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
**Technical Assessment for {job_role}**

**Note**: Full AI-powered assessment not available due to missing HuggingFace API token.

**Sample Questions** (Generated without AI):
1. What is the time complexity of binary search?
   A) O(1) B) O(log n) C) O(n) D) O(n²)
   Correct Answer: B
   Explanation: Binary search divides the search space in half with each iteration.

2. Which data structure is best for implementing a queue?
   A) Array B) Stack C) Linked List D) Tree
   Correct Answer: C
   Explanation: Linked lists provide O(1) insertion and deletion at both ends.

Please add HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP environment variable for full AI-generated assessment.
                """,
                "job_role": job_role,
                "total_questions": num_questions,
                "status": "fallback"
            }
    except Exception as e:
        return {
            "error": f"Error generating technical assessment: {str(e)}",
            "status": "error"
        }

if __name__ == "__main__":
    result = generate_technical_mcqs("Software Engineer", 5)
    print(result)
