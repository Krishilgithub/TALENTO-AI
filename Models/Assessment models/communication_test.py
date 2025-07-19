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
    raise ValueError("HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP not found in .env file 😞")

# Initialize Hugging Face Endpoint
try:
    llm = HuggingFaceEndpoint(
        model ="mistralai/Mistral-7B-Instruct-v0.2",
        huggingfacehub_api_token=hf_api_key,
        temperature=0.5,
        max_new_tokens=1500,
    )
    model = ChatHuggingFace(llm=llm)
except Exception as e:
    raise ValueError(f"Failed to initialize Hugging Face Endpoint: {str(e)} 😵")

# Output parser for JSON
parser = JsonOutputParser()

# Prompt template for communication skills test
comm_template = """
You are an expert in assessing communication skills for job interviews. Generate 5 questions to evaluate communication skills (e.g., clarity, persuasion, professionalism) for a {job_role} role. Format the output as a JSON array:

```json
[
    {{
        "question": "Question text",
        "type": "communication",
        "skill": "Specific communication skill"
    }},
    ...
]
"""
comm_prompt = PromptTemplate(
    input_variables=["job_role"],
    template=comm_template
)

# Create RunnableSequence
comm_chain = RunnableSequence(comm_prompt | model | parser)

# Function to generate communication test
def generate_communication_test(job_role: str = "Software Engineer") -> dict:
    try:
        result = comm_chain.invoke({"job_role": job_role})
        return result
    except Exception as e:
        return {"error": f"Error generating communication test: {str(e)} 😵"}

# Example usage
if __name__ == "__main__":
    result = generate_communication_test("Software Engineer")
    import json
    print(json.dumps(result, indent=2))