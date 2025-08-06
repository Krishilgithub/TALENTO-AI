#!/usr/bin/env python3
"""
Railway Deployment Script
Handles externally-managed-environment issues
"""
import os
import sys
import subprocess

def install_dependencies():
    """Install dependencies with proper flags"""
    try:
        # Try different installation methods
        methods = [
            ["pip", "install", "--break-system-packages", "-r", "requirements.txt"],
            ["pip", "install", "--user", "--break-system-packages", "-r", "requirements.txt"],
            ["python", "-m", "pip", "install", "--user", "--break-system-packages", "-r", "requirements.txt"],
            ["pip", "install", "--user", "-r", "requirements.txt"]
        ]
        
        for method in methods:
            try:
                print(f"Trying: {' '.join(method)}")
                subprocess.check_call(method, cwd="Models/Assessment models")
                print("✅ Dependencies installed successfully")
                return True
            except subprocess.CalledProcessError as e:
                print(f"❌ Method failed: {e}")
                continue
        
        print("❌ All installation methods failed")
        return False
        
    except Exception as e:
        print(f"❌ Error installing dependencies: {e}")
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
    
    # Install dependencies
    if not install_dependencies():
        print("❌ Failed to install dependencies")
        sys.exit(1)
    
    # Start the application
    start_app()

if __name__ == "__main__":
    main() 