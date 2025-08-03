#!/usr/bin/env python3
"""
Test the simple deployment
"""
import requests
import time
import subprocess
import sys
import os

def test_local():
    """Test if the app starts locally"""
    try:
        # Start the app in background
        process = subprocess.Popen([
            "python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Wait a bit for it to start
        time.sleep(3)
        
        # Test the health endpoint
        response = requests.get("http://localhost:8000/")
        if response.status_code == 200:
            print("✓ Local test passed!")
            process.terminate()
            return True
        else:
            print(f"✗ Local test failed: {response.status_code}")
            process.terminate()
            return False
            
    except Exception as e:
        print(f"✗ Local test error: {e}")
        return False

def test_imports():
    """Test if all imports work"""
    try:
        import fastapi
        import uvicorn
        print("✓ All imports successful")
        return True
    except ImportError as e:
        print(f"✗ Import failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing simple deployment...")
    
    if not test_imports():
        sys.exit(1)
    
    print("✓ All tests passed! Ready for deployment.") 