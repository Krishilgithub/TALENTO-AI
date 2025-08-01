# Requires: fastapi, uvicorn, python-multipart
# Install with: pip install fastapi uvicorn python-multipart
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import tempfile
from technical_assessment import generate_technical_mcqs
from resume_optimizer import analyze_resume
from ats_score import calculate_ats_score
from ats_score import process_resume_file, extract_resume_text
from communication_test import generate_communication_test
from domain_questions import generate_domain_questions
from general_aptitude import generate_aptitude_mcqs
from linkedin_post_generator import generate_linkedin_post
from personality_assessment import generate_personality_assessment

app = FastAPI()

# Allow CORS for frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend-domain.vercel.app",  # Replace with your actual frontend URL
        "https://your-frontend-domain.railway.app",  # Replace with your actual frontend URL
        "https://your-frontend-domain.onrender.com",  # Replace with your actual frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/assessment/upload_resume/")
async def upload_resume(file: UploadFile = File(...), num_questions: int = Form(20)):
    # This endpoint seems to be for the technical assessment, let's call the new function
    try:
        # We don't need to save the file for the new general technical assessment
        # We can just use the job_role and num_questions
        result = generate_technical_mcqs(job_role="Software Engineer", num_questions=num_questions)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/api/assessment/technical_assessment/")
async def technical_assessment(job_role: str = Form("Software Engineer"), num_questions: int = Form(10)):
    try:
        result = generate_technical_mcqs(job_role=job_role, num_questions=num_questions)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/api/assessment/ats_score/")
async def ats_score(file: UploadFile = File(...), job_role: str = Form("Software Engineer")):
    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        result = process_resume_file(tmp_path, job_role)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    finally:
        os.remove(tmp_path)

@app.post("/api/assessment/resume_optimize/")
async def resume_optimize(file: UploadFile = File(...), job_role: str = Form("Software Engineer")):
    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        # Use the new extraction logic for both PDF and DOCX
        resume_text = extract_resume_text(tmp_path)
        if resume_text is None or not resume_text.strip():
            return JSONResponse(status_code=400, content={"error": "Could not extract text from the uploaded resume. Supported formats: PDF, DOCX."})
        result = analyze_resume(tmp_path, job_role)  # analyze_resume still expects a file path
        return JSONResponse(content={"result": result})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    finally:
        os.remove(tmp_path)

@app.post("/api/assessment/communication_test/")
async def communication_test(job_role: str = Form("Software Engineer"), num_questions: int = Form(10)):
    try:
        result = generate_communication_test(job_role, num_questions)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/api/assessment/general_aptitude/")
async def general_aptitude(job_role: str = Form("Software Engineer"), num_questions: int = Form(10)):
    try:
        result = generate_aptitude_mcqs(job_role, num_questions)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/api/assessment/domain_questions/")
async def domain_questions(file: UploadFile = File(...), job_role: str = Form("Software Engineer")):
    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        result = generate_domain_questions(tmp_path, job_role, is_pdf=True)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    finally:
        os.remove(tmp_path)

@app.post("/api/assessment/linkedin_post/")
async def linkedin_post_generator(
    post_type: str = Form("Professional Insight"), 
    topic: str = Form("Career Development"),
    post_description: str = Form("Share insights about career growth and professional development")
):
    try:
        result = generate_linkedin_post(post_type=post_type, topic=topic, post_description=post_description)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/api/assessment/personality_assessment/")
async def personality_assessment(
    num_questions: int = Form(10),
    assessment_focus: str = Form("Work Style"),
    job_role: str = Form("Professional")
):
    try:
        result = generate_personality_assessment(num_questions=num_questions, assessment_focus=assessment_focus, job_role=job_role)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)