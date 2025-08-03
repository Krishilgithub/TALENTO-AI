#!/usr/bin/env python3
"""
Simple test to verify deployment will work
"""
import os
import sys

def test_imports():
    """Test if all required modules can be imported"""
    try:
        import fastapi
        print("✓ FastAPI imported successfully")
    except ImportError as e:
        print(f"✗ FastAPI import failed: {e}")
        return False
    
    try:
        import uvicorn
        print("✓ Uvicorn imported successfully")
    except ImportError as e:
        print(f"✗ Uvicorn import failed: {e}")
        return False
    
    try:
        from fastapi import FastAPI
        from fastapi.middleware.cors import CORSMiddleware
        print("✓ FastAPI components imported successfully")
    except ImportError as e:
        print(f"✗ FastAPI components import failed: {e}")
        return False
    
    return True

def test_app_creation():
    """Test if the app can be created"""
    try:
        from fastapi import FastAPI
        from fastapi.middleware.cors import CORSMiddleware
        
        app = FastAPI()
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        print("✓ App creation successful")
        return True
    except Exception as e:
        print(f"✗ App creation failed: {e}")
        return False

def main():
    """Run all tests"""
    print("Testing deployment setup...")
    print("=" * 40)
    
    if not test_imports():
        print("✗ Import tests failed")
        sys.exit(1)
    
    if not test_app_creation():
        print("✗ App creation test failed")
        sys.exit(1)
    
    print("=" * 40)
    print("✓ All tests passed! Deployment should work.")
    print("Port:", os.getenv("PORT", "8000"))

if __name__ == "__main__":
    main() 