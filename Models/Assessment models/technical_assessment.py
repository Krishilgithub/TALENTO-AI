from langchain_huggingface import ChatHuggingFace, HuggingFaceEmbeddings, HuggingFaceEndpoint
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage, ChatMessage
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
import json
import os
import re

load_dotenv()

hf_api_key = os.getenv('HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP')

llm = HuggingFaceEndpoint(
    model="mistralai/Mistral-7B-Instruct-v0.2",
    task="text-generation",
    huggingfacehub_api_token=hf_api_key,
    temperature=0.5
)

model = ChatHuggingFace(llm=llm)
parser = StrOutputParser() # Use StrOutputParser to get raw output

def try_parse_json(raw_output: str):
    """
    Tries to parse a string that may contain a JSON object.
    It cleans the string by extracting content between the first '[' and last ']',
    and replaces single quotes with double quotes.
    """
    try:
        # Find the start and end of the JSON array
        start = raw_output.find('[')
        end = raw_output.rfind(']')
        if start == -1 or end == -1:
            return None
        
        json_str = raw_output[start:end+1]
        
        # Replace single quotes with double quotes, being careful not to replace them inside strings
        json_str = re.sub(r"'", '"', json_str)
        
        return json.loads(json_str)
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        return None

def generate_assessment_from_pdf(pdf_file_path, num_questions=20):
    # This function is not used by the technical assessment page, but we'll keep it for now.
    # The technical assessment page uses a general prompt, not one based on a PDF.
    pass

def generate_technical_mcqs(job_role: str = "Software Engineer", num_questions: int = 20):
    """
    Generates general technical MCQs for a given job role.
    """
    general_prompt = PromptTemplate(
        template=(
            "You are an expert technical interviewer. "
            "Generate {num_questions} general multiple-choice questions (MCQs) for a technical assessment in software engineering. "
            "Each question must have 4 options and 1 correct answer. "
            "Return ONLY a valid JSON array of objects, with no extra text, comments, or explanations. "
            "Each object must have 'Question', 'Options', and 'Answer' fields. "
            "Use double quotes for all keys and string values. Do not use single quotes. "
            "Example: [{{'Question': '...', 'Options': ['...'], 'Answer': '...'}}]"
        ),
        input_variables=['num_questions'],
    )
    
    chain = general_prompt | model | parser # Use StrOutputParser
    
    try:
        raw_result = chain.invoke({'num_questions': num_questions})
        
        parsed_result = try_parse_json(raw_result)
        
        if parsed_result is not None:
            # Reformat the result to match the expected structure
            questions = [item['Question'] for item in parsed_result]
            answers = [item['Answer'] for item in parsed_result]
            options = [item['Options'] for item in parsed_result]
            return {'questions': questions, 'answers': answers, 'options': options}
        else:
            print("Output parsing failed. Raw output:")
            print(raw_result)
            return {'questions': [], 'answers': [], 'options': [], 'error': 'Output parsing failed. Raw output: ' + raw_result}

    except Exception as e:
        print(f"An error occurred: {e}")
        return {'questions': [], 'answers': [], 'options': [], 'error': 'An error occurred while generating questions.'}


if __name__ == "__main__":
    import sys
    result = generate_technical_mcqs()
    print(json.dumps(result, indent=2))
