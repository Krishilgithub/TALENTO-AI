#!/usr/bin/env python3
"""
Railway Deployment Script
Handles package installation and externally-managed-environment issues
"""
import os
import sys
import subprocess

def install_minimal_packages():
    """Install minimal required packages"""
    try:
        print("📦 Installing minimal packages...")
        subprocess.check_call([
            "pip", "install", "--break-system-packages", 
            "-r", "Models/Assessment models/requirements_minimal.txt"
        ])
        print("✅ Minimal packages installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install minimal packages: {e}")
        return False

def install_ai_packages():
    """Install AI packages with fallback"""
    try:
        print("🤖 Installing AI packages...")
        ai_packages = [
            "langchain==0.1.0",
            "langchain-huggingface==0.3.1", 
            "langchain-core==0.1.0",
            "pydantic==2.5.0",
            "typing-extensions==4.8.0"
        ]
        
        for package in ai_packages:
            try:
                subprocess.check_call([
                    "pip", "install", "--break-system-packages", package
                ])
                print(f"✅ {package}")
            except subprocess.CalledProcessError as e:
                print(f"⚠️  {package} failed: {e}")
                continue
        
        print("✅ AI packages installation completed")
        return True
    except Exception as e:
        print(f"❌ Error installing AI packages: {e}")
        return False

def test_packages():
    """Test if packages can be imported"""
    try:
        print("🧪 Testing package imports...")
        subprocess.check_call([
            "python", "Models/Assessment models/test_packages.py"
        ])
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Package test failed: {e}")
        return False

def start_app():
    """Start the FastAPI application"""
    try:
        print("🚀 Starting Talento AI Backend...")
        
        # Change to the assessment models directory
        os.chdir("Models/Assessment models")
        
        # Import and start the app
        from start import main
        main()
        
    except Exception as e:
        print(f"❌ Error starting application: {e}")
        sys.exit(1)

def main():
    """Main deployment function"""
    print("🚀 Railway Deployment Script")
    print("=" * 40)
    
    # Install minimal packages first
    if not install_minimal_packages():
        print("❌ Failed to install minimal packages")
        sys.exit(1)
    
    # Try to install AI packages (optional)
    install_ai_packages()
    
    # Test packages
    test_packages()
    
    # Start the application
    start_app()

if __name__ == "__main__":
    main() 