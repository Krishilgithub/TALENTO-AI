import os
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
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
    raise ValueError(f"Failed to initialize Hugging Face Endpoint: {str(e)} 😵")


parser = JsonOutputParser()

# Prompt template for generating aptitude MCQs
mcq_template = """
You are an expert in creating aptitude questions for job assessments. Generate 20 multiple-choice questions (MCQs) covering quantitative reasoning, logical reasoning, and verbal ability, suitable for a {job_role} job assessment. Each question should have 4 answer options, with one correct answer. Format the output as a JSON object with the following structure:

```json
[
    {{
        "question": "Question text",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correct_answer": "Option X",
        "explanation": "Explanation of why this is correct"
    }},
    ...
]
```

Ensure questions are relevant, clear, and appropriate for job assessments.
"""
mcq_prompt = PromptTemplate(
    input_variables=["job_role"],
    template=mcq_template
)

# Create RunnableSequence
mcq_chain = RunnableSequence(mcq_prompt | model | parser)

# Function to generate MCQs
def generate_aptitude_mcqs(job_role: str = "Software Engineer") -> dict:
    try:
        result = mcq_chain.invoke({"job_role": job_role})
        if not result:
            return {"error": "No MCQs generated. Please try again. 😐"}
        return result
    except Exception as e:
        return {"error": f"Error generating MCQs: {str(e)} 😵"}

# Example usage
if __name__ == "__main__":
    result = generate_aptitude_mcqs("Software Engineer")
    import json
    print(json.dumps(result, indent=2))