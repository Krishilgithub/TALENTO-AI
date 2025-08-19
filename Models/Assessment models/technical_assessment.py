import os
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
from llm_provider import get_chat_model

# Load environment variables
load_dotenv()

model = get_chat_model()

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

def generate_technical_mcqs(job_role: str = "Software Engineer", num_questions: int = 10, difficulty: str = "moderate") -> dict:
    print(f"🔄 Generating {num_questions} technical questions for {job_role} ({difficulty} difficulty)")
    
    try:
        if model:
            # Try AI generation first
            try:
                prompt = technical_assessment_prompt.format(
                    job_role=job_role, 
                    num_questions=num_questions, 
                    difficulty=difficulty
                )
                result = model.invoke(prompt)
                
                print("✅ AI questions generated successfully!")
                
                return {
                    "questions": result.content,
                    "source": "openrouter_ai",
                    "job_role": job_role,
                    "total_questions": num_questions,
                    "difficulty": difficulty,
                    "status": "success"
                }
            except Exception as ai_error:
                print(f"❌ AI generation failed: {ai_error}")
                print("🔄 Falling back to predefined questions...")
        else:
            print("⚠️ No model available, using fallback questions...")
        
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
            },
            {
                "question": "What is the difference between a stack and a queue?",
                "options": ["A stack is LIFO, a queue is FIFO", "A stack is FIFO, a queue is LIFO", "Both are LIFO", "Both are FIFO"],
                "correct_answer": "A stack is LIFO, a queue is FIFO",
                "explanation": "Stack follows Last-In-First-Out (LIFO) principle, while Queue follows First-In-First-Out (FIFO) principle."
            },
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
