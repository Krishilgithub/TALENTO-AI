from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Talento AI Test API",
    description="Simple test API for Railway deployment",
    version="1.0.0"
)

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import assessment modules
try:
    from technical_assessment import generate_technical_mcqs
    logger.info("✅ Successfully imported technical_assessment")
except Exception as e:
    logger.error(f"❌ Failed to import technical_assessment: {e}")
    generate_technical_mcqs = None

try:
    from personality_assessment import generate_personality_assessment
    logger.info("✅ Successfully imported personality_assessment")
except Exception as e:
    logger.error(f"❌ Failed to import personality_assessment: {e}")
    generate_personality_assessment = None

try:
    from communication_test import generate_communication_test
    logger.info("✅ Successfully imported communication_test")
except Exception as e:
    logger.error(f"❌ Failed to import communication_test: {e}")
    generate_communication_test = None

try:
    from general_aptitude import generate_general_aptitude
    logger.info("✅ Successfully imported general_aptitude")
except Exception as e:
    logger.error(f"❌ Failed to import general_aptitude: {e}")
    generate_general_aptitude = None

try:
    from resume_optimizer import optimize_resume
    logger.info("✅ Successfully imported resume_optimizer")
except Exception as e:
    logger.error(f"❌ Failed to import resume_optimizer: {e}")
    optimize_resume = None

try:
    from ats_score import calculate_ats_score
    logger.info("✅ Successfully imported ats_score")
except Exception as e:
    logger.error(f"❌ Failed to import ats_score: {e}")
    calculate_ats_score = None

try:
    from linkedin_post_generator import generate_linkedin_post
    logger.info("✅ Successfully imported linkedin_post_generator")
except Exception as e:
    logger.error(f"❌ Failed to import linkedin_post_generator: {e}")
    generate_linkedin_post = None

@app.get("/")
async def root():
    """Root endpoint for healthcheck"""
    logger.info("Health check endpoint called")
    return {
        "message": "Talento AI Test API is running!",
        "status": "healthy",
        "version": "1.0.0",
        "port": os.getenv("PORT", "8000")
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    logger.info("Health check endpoint called")
    return {
        "status": "healthy",
        "message": "Service is running"
    }

@app.get("/test")
async def test():
    """Test endpoint"""
    logger.info("Test endpoint called")
    return {"message": "Test endpoint working!"}

# Assessment endpoints with real functionality
@app.post("/api/assessment/technical_assessment/")
async def technical_assessment(job_role: str = Form("Software Engineer"), num_questions: int = Form(10), difficulty: str = Form("moderate")):
    """Technical assessment endpoint"""
    logger.info(f"Technical assessment called with job_role: {job_role}, num_questions: {num_questions}, difficulty: {difficulty}")
    
    if generate_technical_mcqs:
        try:
            result = generate_technical_mcqs(job_role, num_questions, difficulty)
            logger.info("✅ Technical assessment generated successfully")
            return result
        except Exception as e:
            logger.error(f"❌ Error in technical assessment: {e}")
            return {
                "error": f"Failed to generate technical assessment: {str(e)}",
                "status": "error"
            }
    else:
        logger.warning("⚠️ Technical assessment module not available, returning fallback")
        return {
            "error": "Technical assessment module not available",
            "status": "error"
        }

@app.post("/api/assessment/personality_assessment/")
async def personality_assessment(num_questions: int = Form(10), assessment_focus: str = Form("Work Style"), job_role: str = Form("Professional")):
    """Personality assessment endpoint"""
    logger.info(f"Personality assessment called with num_questions: {num_questions}, focus: {assessment_focus}, job_role: {job_role}")
    
    if generate_personality_assessment:
        try:
            result = generate_personality_assessment(num_questions, assessment_focus, job_role)
            logger.info("✅ Personality assessment generated successfully")
            return result
        except Exception as e:
            logger.error(f"❌ Error in personality assessment: {e}")
            return {
                "error": f"Failed to generate personality assessment: {str(e)}",
                "status": "error"
            }
    else:
        logger.warning("⚠️ Personality assessment module not available, returning fallback")
        return {
            "error": "Personality assessment module not available",
            "status": "error"
        }

@app.post("/api/assessment/communication_test/")
async def communication_test(num_questions: int = Form(10), test_type: str = Form("General")):
    """Communication test endpoint"""
    logger.info(f"Communication test called with num_questions: {num_questions}, test_type: {test_type}")
    
    if generate_communication_test:
        try:
            result = generate_communication_test(num_questions, test_type)
            logger.info("✅ Communication test generated successfully")
            return result
        except Exception as e:
            logger.error(f"❌ Error in communication test: {e}")
            return {
                "error": f"Failed to generate communication test: {str(e)}",
                "status": "error"
            }
    else:
        logger.warning("⚠️ Communication test module not available, returning fallback")
        return {
            "error": "Communication test module not available",
            "status": "error"
        }

@app.post("/api/assessment/general_aptitude/")
async def general_aptitude(num_questions: int = Form(10), aptitude_type: str = Form("General")):
    """General aptitude endpoint"""
    logger.info(f"General aptitude called with num_questions: {num_questions}, aptitude_type: {aptitude_type}")
    
    if generate_general_aptitude:
        try:
            result = generate_general_aptitude(num_questions, aptitude_type)
            logger.info("✅ General aptitude generated successfully")
            return result
        except Exception as e:
            logger.error(f"❌ Error in general aptitude: {e}")
            return {
                "error": f"Failed to generate general aptitude: {str(e)}",
                "status": "error"
            }
    else:
        logger.warning("⚠️ General aptitude module not available, returning fallback")
        return {
            "error": "General aptitude module not available",
            "status": "error"
        }

@app.post("/api/assessment/resume_optimize/")
async def resume_optimize(resume_text: str = Form(...), job_description: str = Form(...)):
    """Resume optimization endpoint"""
    logger.info("Resume optimization called")
    
    if optimize_resume:
        try:
            result = optimize_resume(resume_text, job_description)
            logger.info("✅ Resume optimization completed successfully")
            return result
        except Exception as e:
            logger.error(f"❌ Error in resume optimization: {e}")
            return {
                "error": f"Failed to optimize resume: {str(e)}",
                "status": "error"
            }
    else:
        logger.warning("⚠️ Resume optimizer module not available, returning fallback")
        return {
            "error": "Resume optimizer module not available",
            "status": "error"
        }

@app.post("/api/assessment/ats_score/")
async def ats_score(resume_text: str = Form(...), job_description: str = Form(...)):
    """ATS score endpoint"""
    logger.info("ATS score called")
    
    if calculate_ats_score:
        try:
            result = calculate_ats_score(resume_text, job_description)
            logger.info("✅ ATS score calculated successfully")
            return result
        except Exception as e:
            logger.error(f"❌ Error in ATS score calculation: {e}")
            return {
                "error": f"Failed to calculate ATS score: {str(e)}",
                "status": "error"
            }
    else:
        logger.warning("⚠️ ATS score module not available, returning fallback")
        return {
            "error": "ATS score module not available",
            "status": "error"
        }

@app.post("/api/assessment/linkedin_post/")
async def linkedin_post(topic: str = Form(...), tone: str = Form("Professional"), post_type: str = Form("Article")):
    """LinkedIn post endpoint"""
    logger.info(f"LinkedIn post called with topic: {topic}, tone: {tone}, type: {post_type}")
    
    if generate_linkedin_post:
        try:
            result = generate_linkedin_post(topic, tone, post_type)
            logger.info("✅ LinkedIn post generated successfully")
            return result
        except Exception as e:
            logger.error(f"❌ Error in LinkedIn post generation: {e}")
            return {
                "error": f"Failed to generate LinkedIn post: {str(e)}",
                "status": "error"
            }
    else:
        logger.warning("⚠️ LinkedIn post generator module not available, returning fallback")
        return {
            "error": "LinkedIn post generator module not available",
            "status": "error"
        }

@app.on_event("startup")
async def startup_event():
    """Log startup information"""
    logger.info("Application starting up...")
    logger.info(f"PORT: {os.getenv('PORT', '8000')}")
    
    # Log module availability
    modules = {
        "technical_assessment": generate_technical_mcqs is not None,
        "personality_assessment": generate_personality_assessment is not None,
        "communication_test": generate_communication_test is not None,
        "general_aptitude": generate_general_aptitude is not None,
        "resume_optimizer": optimize_resume is not None,
        "ats_score": calculate_ats_score is not None,
        "linkedin_post_generator": generate_linkedin_post is not None
    }
    
    logger.info("Module availability:")
    for module, available in modules.items():
        status = "✅ Available" if available else "❌ Not available"
        logger.info(f"  {module}: {status}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 