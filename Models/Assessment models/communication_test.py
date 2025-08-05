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

# Prompt template for communication assessment
communication_assessment_template = """
You are an expert communication skills assessor. Generate {num_questions} communication scenarios with {difficulty} difficulty level.

Cover these communication skills:
1. Written communication
2. Verbal communication
3. Presentation skills
4. Conflict resolution
5. Team collaboration
6. Client communication

For {difficulty} difficulty:
- Easy: Basic communication scenarios, straightforward situations
- Moderate: Intermediate complexity, some critical thinking required
- Hard: Complex scenarios, advanced communication skills required

Format each scenario as:
Scenario {{number}}: [Real-world communication scenario]
Skill: [Specific communication skill being tested]
Question: [What would you do in this situation?]

Make scenarios realistic workplace situations with {difficulty} difficulty level.
"""

communication_assessment_prompt = PromptTemplate(
    input_variables=["num_questions", "difficulty"],
    template=communication_assessment_template
)

# Create RunnableSequence only if model is available
communication_assessment_chain = None
if model:
    communication_assessment_chain = RunnableSequence(communication_assessment_prompt | model | parser)

def generate_communication_test(num_questions: int = 10, difficulty: str = "moderate") -> dict:
    try:
        if communication_assessment_chain:
            result = communication_assessment_chain.invoke({"num_questions": num_questions, "difficulty": difficulty})
            return {
                "questions": result,
                "total_questions": num_questions,
                "difficulty": difficulty,
                "status": "success"
            }
        else:
            # Fallback response with structured data
            fallback_questions = [
                {
                    "question": "You need to explain a complex technical concept to a non-technical client. How would you approach this communication?",
                    "skill": "Technical Communication"
                },
                {
                    "question": "A team member disagrees with your approach to a project. How would you handle this conflict professionally?",
                    "skill": "Conflict Resolution"
                },
                {
                    "question": "You need to present your project findings to senior management. How would you structure your presentation?",
                    "skill": "Presentation Skills"
                },
                {
                    "question": "A client is frustrated with a delayed delivery. How would you communicate this situation to them?",
                    "skill": "Client Communication"
                },
                {
                    "question": "You need to write a detailed technical report for stakeholders. What key elements would you include?",
                    "skill": "Written Communication"
                }
            ]
            
            # Return only the requested number of questions
            return {
                "questions": fallback_questions[:min(num_questions, len(fallback_questions))],
                "total_questions": min(num_questions, len(fallback_questions)),
                "difficulty": difficulty,
                "status": "fallback"
            }
    except Exception as e:
        return {
            "error": f"Error generating communication questions: {str(e)}",
            "status": "error"
        }

if __name__ == "__main__":
    result = generate_communication_test("Software Engineer", 5)
    print(result)