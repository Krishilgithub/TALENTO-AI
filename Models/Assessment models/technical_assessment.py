from langchain_huggingface import ChatHuggingFace, HuggingFaceEmbeddings, HuggingFaceEndpoint
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage, ChatMessage
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
import json
import os
import tempfile
load_dotenv()

hf_api_key = os.getenv('HUGGINGFACEHUB_ACCESS_TOKEN')

llm = HuggingFaceEndpoint(
    model="mistralai/Mistral-7B-Instruct-v0.2",
    task="text-generation",
    huggingfacehub_api_token=hf_api_key,
    temperature=0.5
)

model = ChatHuggingFace(llm=llm)

parser1 = StrOutputParser()
parser2 = JsonOutputParser()

resume_loader1 = PyPDFLoader("./data/Krishil Agrawal Resume - ML.pdf")
resume_loader2 = PyPDFLoader("./data/Krishil Agrawal Resume - Web.pdf")

resume1 = resume_loader1.load()
resume2 = resume_loader2.load()

template1 = PromptTemplate(
  template="Analyze the whole resume and extract all the technical skills mentioned in the {resume1}",
  input_variables=['resume1']
)

template2 = PromptTemplate(
  template=(
    "You are given a list of technical skills. "
    "Generate 20 intermediate level MCQs from the {skills} with the right answer written after the option. "
    "Return ONLY a valid JSON array of objects, each with 'Question', 'Options', and 'Answer' fields. "
    "Do not include any extra text or explanation. "
    "Format: {format_instruction}"
  ),
  input_variables=['level', 'technical_skills'],
  partial_variables={'format_instruction': parser2.get_format_instructions()}
)

chain = template1 | model | parser1 | template2 | model | parser2

result = chain.invoke({'resume1': resume1 })

def generate_assessment_from_pdf(pdf_file_path):
    resume_loader = PyPDFLoader(pdf_file_path)
    resume = resume_loader.load()
    
    template1 = PromptTemplate(
      template="Analyze the whole resume and extract all the technical skills mentioned in the {resume1}",
      input_variables=['resume1']
    )
    
    # Use the updated template2 above
    chain = template1 | model | parser1 | template2 | model | parser2
    try:
        result = chain.invoke({'resume1': resume })
    except Exception as e:
        print("Output parsing failed. Raw output:")
        print(e)
        return {'questions': [], 'answers': [], 'options': [], 'error': 'Output parsing failed. Please try again.'}
    questions = []
    answers = []
    options = []
    if isinstance(result, list):
        for mcq in result:
            if isinstance(mcq, dict):
                question = mcq.get('Question')
                answer = mcq.get('Answer')
                option = mcq.get('Options')
                questions.append(question)
                answers.append(answer)
                options.append(option)
    elif isinstance(result, dict):
        for mcq in result.values():
            if isinstance(mcq, dict):
                question = mcq.get('Question')
                answer = mcq.get('Answer')
                option = mcq.get('Options')
                questions.append(question)
                answers.append(answer)
                options.append(option)
    return {
        'questions': questions,
        'answers': answers,
        'options': options
    }

# If run as a script, test with a sample file
if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
        result = generate_assessment_from_pdf(pdf_path)
        print(json.dumps(result, indent=2))
    else:
        print("Usage: python technical_assessment.py <resume.pdf>")
