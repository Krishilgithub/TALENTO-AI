#!/usr/bin/env python3
"""
Startup script for Railway deployment
"""
import os
import sys
import logging
import subprocess
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_environment():
    """Check if required environment variables are set"""
    port = os.getenv("PORT")
    if not port:
        logger.warning("PORT environment variable not set, using default 8000")
        os.environ["PORT"] = "8000"
    else:
        logger.info(f"Using PORT: {port}")
    
    return True

def install_dependencies():
    """Install dependencies if needed"""
    try:
        import fastapi
        import uvicorn
        logger.info("✅ Dependencies already available")
        return True
    except ImportError:
        logger.info("Installing dependencies...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
            logger.info("✅ Dependencies installed successfully")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"❌ Failed to install dependencies: {e}")
            return False

def start_app():
    """Start the FastAPI application"""
    try:
        logger.info("Starting FastAPI application...")
        
        # Import and start the app
        from test_app import app
        import uvicorn
        
        port = int(os.getenv("PORT", 8000))
        logger.info(f"Starting server on port {port}")
        
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=port,
            log_level="info"
        )
        
    except Exception as e:
        logger.error(f"❌ Failed to start application: {e}")
        sys.exit(1)

def main():
    """Main startup function"""
    logger.info("🚀 Starting Talento AI API...")
    
    # Check environment
    if not check_environment():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Start the application
    start_app()

if __name__ == "__main__":
    main() 