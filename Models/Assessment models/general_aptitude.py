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
You are an expert aptitude test creator. Generate {num_questions} multiple-choice aptitude questions for {job_role} position with {difficulty} difficulty level.

Cover these areas:
1. Logical reasoning
2. Numerical ability
3. Verbal reasoning
4. Abstract thinking
5. Problem-solving
6. Critical thinking

For {difficulty} difficulty:
- Easy: Basic concepts, straightforward questions
- Moderate: Intermediate complexity, some analytical thinking required
- Hard: Advanced concepts, complex problem-solving required

Format each question as:
Q{{number}}. [Question text]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct Answer: [A/B/C/D]
Explanation: [Brief explanation]

Make questions relevant to {job_role} and {difficulty} difficulty level.
"""

aptitude_assessment_prompt = PromptTemplate(
    input_variables=["job_role", "num_questions", "difficulty"],
    template=aptitude_assessment_template
)

# Create RunnableSequence only if model is available
aptitude_assessment_chain = None
if model:
    aptitude_assessment_chain = RunnableSequence(aptitude_assessment_prompt | model | parser)

def generate_aptitude_mcqs(job_role: str = "Software Engineer", num_questions: int = 10, difficulty: str = "moderate") -> dict:
    try:
        if aptitude_assessment_chain:
            result = aptitude_assessment_chain.invoke({"job_role": job_role, "num_questions": num_questions, "difficulty": difficulty})
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
                    "question": "If a train travels 120 km in 2 hours, what is its speed in km/h?",
                    "options": ["40", "60", "80", "100"],
                    "correct_answer": "60",
                    "explanation": "Speed = Distance/Time = 120/2 = 60 km/h"
                },
                {
                    "question": "Which number comes next: 2, 4, 8, 16, __?",
                    "options": ["24", "32", "30", "28"],
                    "correct_answer": "32",
                    "explanation": "Each number is multiplied by 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32"
                },
                {
                    "question": "If all Roses are Flowers and some Flowers are Red, then:",
                    "options": ["All Roses are Red", "Some Roses are Red", "No Roses are Red", "Cannot be determined"],
                    "correct_answer": "Cannot be determined",
                    "explanation": "We know Roses are Flowers, but we don't know if the Red Flowers include Roses"
                },
                {
                    "question": "A company's revenue increased by 20% from 2022 to 2023. If revenue in 2022 was $100,000, what was the revenue in 2023?",
                    "options": ["$110,000", "$120,000", "$130,000", "$140,000"],
                    "correct_answer": "$120,000",
                    "explanation": "20% increase = 100,000 × 1.20 = $120,000"
                },
                {
                    "question": "Which word is most similar to 'Eloquent'?",
                    "options": ["Quiet", "Articulate", "Simple", "Rude"],
                    "correct_answer": "Articulate",
                    "explanation": "Eloquent means fluent or persuasive in speech, similar to articulate"
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
            "error": f"Error generating aptitude questions: {str(e)}",
            "status": "error"
        }

if __name__ == "__main__":
    result = generate_aptitude_mcqs("Software Engineer", 5)
    print(result)