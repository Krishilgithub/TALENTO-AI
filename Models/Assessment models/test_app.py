from fastapi import FastAPI
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

@app.on_event("startup")
async def startup_event():
    """Log startup information"""
    logger.info("Application starting up...")
    logger.info(f"PORT: {os.getenv('PORT', '8000')}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 