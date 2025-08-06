#!/usr/bin/env python3
"""
Simple deployment test script for Railway
"""
import os
import sys
import subprocess
import time

def test_dependencies():
    """Test if all dependencies are available"""
    try:
        import fastapi
        import uvicorn
        print("✅ All dependencies are available")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        return False

def test_app_import():
    """Test if the app can be imported"""
    try:
        from test_app import app
        print("✅ App can be imported successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to import app: {e}")
        return False

def test_port_availability():
    """Test if PORT environment variable is set"""
    port = os.getenv("PORT")
    if port:
        print(f"✅ PORT environment variable is set: {port}")
        return True
    else:
        print("⚠️  PORT environment variable not set, will use default 8000")
        return True

def main():
    """Run all tests"""
    print("🚀 Running deployment tests...")
    
    tests = [
        test_dependencies,
        test_app_import,
        test_port_availability
    ]
    
    passed = 0
    for test in tests:
        if test():
            passed += 1
    
    print(f"\n📊 Test Results: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("✅ All tests passed! Ready for deployment.")
        return 0
    else:
        print("❌ Some tests failed. Please fix the issues before deploying.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 