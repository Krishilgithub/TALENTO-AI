from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os

app = FastAPI(
    title="Talento AI API",
    description="AI-powered career assessment API",
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
        "message": "Talento AI API is running!",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Service is running"
    }

@app.get("/test")
async def test():
    """Test endpoint"""
    return {"message": "Test endpoint working!", "status": "success"}

@app.post("/api/assessment/technical_assessment/")
async def technical_assessment():
    """Technical assessment endpoint"""
    return JSONResponse(content={
        "questions": "Sample technical questions for Software Engineer position",
        "job_role": "Software Engineer",
        "total_questions": 5,
        "status": "success"
    })

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 