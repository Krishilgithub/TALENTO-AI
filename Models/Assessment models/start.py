#!/usr/bin/env python3
import os
import sys
import uvicorn
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    """Start the API server with fallback options"""
    port = int(os.getenv("PORT", 8000))
    
    # Try to import and start the main API
    try:
        logger.info("Attempting to start main API...")
        import assessment_api
        uvicorn.run(assessment_api.app, host="0.0.0.0", port=port)
    except Exception as e:
        logger.error(f"Failed to start main API: {e}")
        logger.info("Starting fallback simple API...")
        try:
            import simple_api
            uvicorn.run(simple_api.app, host="0.0.0.0", port=port)
        except Exception as e2:
            logger.error(f"Failed to start simple API: {e2}")
            sys.exit(1)

if __name__ == "__main__":
    main() 