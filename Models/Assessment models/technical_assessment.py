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

# Prompt template for technical assessment
technical_assessment_template = """
You are an expert technical interviewer. Generate {num_questions} technical multiple-choice questions for {job_role} position with {difficulty} difficulty level.

Cover these technical areas:
1. Programming fundamentals
2. Data structures and algorithms
3. System design
4. Database concepts
5. Web technologies
6. DevOps and tools
7. Problem-solving
8. Best practices

For {difficulty} difficulty:
- Easy: Basic concepts, fundamental knowledge
- Moderate: Intermediate complexity, practical application
- Hard: Advanced concepts, deep technical knowledge required

Format each question as:
Q{{number}}. [Technical question]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct Answer: [A/B/C/D]
Explanation: [Brief technical explanation]

Make questions relevant to {job_role} and {difficulty} difficulty level.
"""

technical_assessment_prompt = PromptTemplate(
    input_variables=["job_role", "num_questions", "difficulty"],
    template=technical_assessment_template
)

# Create RunnableSequence only if model is available
technical_assessment_chain = None
if model:
    technical_assessment_chain = RunnableSequence(technical_assessment_prompt | model | parser)

def generate_technical_mcqs(job_role: str = "Software Engineer", num_questions: int = 10, difficulty: str = "moderate") -> dict:
    try:
        if technical_assessment_chain:
            result = technical_assessment_chain.invoke({"job_role": job_role, "num_questions": num_questions, "difficulty": difficulty})
            return {
                "questions": result,
                "job_role": job_role,
                "total_questions": num_questions,
                "difficulty": difficulty,
                "status": "success"
            }
        else:
            # Fallback response with structured data
            fallback_questions = [
                {
                    "question": "What is the time complexity of binary search?",
                    "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"],
                    "correct_answer": "O(log n)",
                    "explanation": "Binary search divides the search space in half each iteration, resulting in logarithmic time complexity."
                },
                {
                    "question": "Which data structure is best for implementing a stack?",
                    "options": ["Array", "Linked List", "Tree", "Graph"],
                    "correct_answer": "Array",
                    "explanation": "Arrays provide O(1) push and pop operations, making them ideal for stack implementation."
                },
                {
                    "question": "What does REST stand for in web development?",
                    "options": ["Remote State Transfer", "Representational State Transfer", "Resource State Transfer", "Request State Transfer"],
                    "correct_answer": "Representational State Transfer",
                    "explanation": "REST is an architectural style for designing networked applications."
                },
                {
                    "question": "Which HTTP method is used to create a new resource?",
                    "options": ["GET", "POST", "PUT", "DELETE"],
                    "correct_answer": "POST",
                    "explanation": "POST is typically used to create new resources in RESTful APIs."
                },
                {
                    "question": "What is the primary purpose of a database index?",
                    "options": ["To save storage space", "To improve query performance", "To ensure data integrity", "To encrypt data"],
                    "correct_answer": "To improve query performance",
                    "explanation": "Indexes speed up data retrieval by providing quick access paths to data."
                }
            ]
            
            # Return only the requested number of questions
            return {
                "questions": fallback_questions[:min(num_questions, len(fallback_questions))],
                "job_role": job_role,
                "total_questions": min(num_questions, len(fallback_questions)),
                "difficulty": difficulty,
                "status": "fallback"
            }
    except Exception as e:
        return {
            "error": f"Error generating technical questions: {str(e)}",
            "status": "error"
        }

if __name__ == "__main__":
    result = generate_technical_mcqs("Software Engineer", 5)
    print(result)
