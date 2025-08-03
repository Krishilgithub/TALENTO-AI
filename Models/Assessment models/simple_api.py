from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os

app = FastAPI(
    title="Talento AI Simple API",
    description="Simple API for Railway deployment testing",
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

@app.get("/")
async def root():
    """Root endpoint for healthcheck"""
    return {
        "message": "Talento AI Simple API is running!",
        "status": "healthy",
        "version": "1.0.0",
        "deployment": "successful"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Service is running",
        "deployment": "successful"
    }

@app.get("/test")
async def test():
    """Test endpoint"""
    return {"message": "Test endpoint working!", "status": "success"}

@app.post("/api/assessment/technical_assessment/")
async def technical_assessment_fallback():
    """Fallback technical assessment endpoint"""
    return JSONResponse(content={
        "questions": "Sample technical questions for Software Engineer position",
        "job_role": "Software Engineer",
        "total_questions": 5,
        "status": "fallback",
        "message": "This is a fallback response while the main service initializes"
    })

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 