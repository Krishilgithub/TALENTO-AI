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

def generate_communication_test(num_questions: int = 10, difficulty: str = "moderate") -> dict:
    print(f"🔄 Generating {num_questions} communication test scenarios ({difficulty} difficulty)")
    
    try:
        if model:
            # Try AI generation first
            try:
                prompt = communication_assessment_prompt.format(
                    num_questions=num_questions, 
                    difficulty=difficulty
                )
                result = model.invoke(prompt)
                
                print("✅ AI communication scenarios generated successfully!")
                
                return {
                    "questions": result.content,
                    "source": "openrouter_ai",
                    "total_questions": num_questions,
                    "difficulty": difficulty,
                    "status": "success"
                }
            except Exception as ai_error:
                print(f"❌ AI generation failed: {ai_error}")
                print("🔄 Falling back to predefined scenarios...")
        else:
            print("⚠️ No model available, using fallback scenarios...")
        
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
    result = generate_communication_test(5, "moderate")
    print(result)