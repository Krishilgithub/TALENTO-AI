from langchain_huggingface import ChatHuggingFace, HuggingFaceEmbeddings, HuggingFaceEndpoint
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage, ChatMessage
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
import json
import os
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
  template="You have given a list of technical skills now generate 20 intermediate level mcqs from the {skills} with the right answer written after the option. Give output as a dictionary containing the question, options and answers: \n {format_instruction}",
  input_variables=['level', 'technical_skills'],
  partial_variables={'format_instruction': parser2.get_format_instructions() }
)

chain = template1 | model | parser1 | template2 | model | parser2

result = chain.invoke({'resume1': resume1 })

questions = []
answers = []
options = []
for mcq_key in result:
    question = result[mcq_key]['Question']
    answer = result[mcq_key]["Answer"]
    option = result[mcq_key]["Options"]
    questions.append(question)
    answers.append(answer)
    options.append(option)
