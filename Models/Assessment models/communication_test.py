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
You are an expert communication skills assessor. Generate {num_questions} communication assessment questions for {job_role} position.

Cover these areas:
1. Written communication
2. Verbal communication
3. Presentation skills
4. Interpersonal skills
5. Conflict resolution
6. Professional etiquette
7. Email writing
8. Meeting facilitation

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

communication_assessment_prompt = PromptTemplate(
    input_variables=["job_role", "num_questions"],
    template=communication_assessment_template
)

# Create RunnableSequence only if model is available
communication_assessment_chain = None
if model:
    communication_assessment_chain = RunnableSequence(communication_assessment_prompt | model | parser)

def generate_communication_test(job_role: str = "Software Engineer", num_questions: int = 10) -> dict:
    try:
        if communication_assessment_chain:
            result = communication_assessment_chain.invoke({"job_role": job_role, "num_questions": num_questions})
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
**Communication Assessment for {job_role}**

**Note**: Full AI-powered assessment not available due to missing HuggingFace API token.

**Sample Questions** (Generated without AI):
1. When writing a professional email, which is the best approach?
   A) Use informal language B) Be concise and clear C) Include personal details D) Use all caps
   Correct Answer: B
   Explanation: Professional emails should be concise, clear, and respectful.

2. In a team meeting, what should you do if you disagree with a colleague?
   A) Interrupt them immediately B) Listen first, then respectfully share your view C) Stay silent D) Leave the meeting
   Correct Answer: B
   Explanation: Professional communication involves active listening and respectful disagreement.

Please add HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP environment variable for full AI-generated assessment.
                """,
                "job_role": job_role,
                "total_questions": num_questions,
                "status": "fallback"
            }
    except Exception as e:
        return {
            "error": f"Error generating communication assessment: {str(e)}",
            "status": "error"
        }

if __name__ == "__main__":
    result = generate_communication_test("Software Engineer", 5)
    print(result)