#!/usr/bin/env python3
"""
Test script to verify package installation
"""
import sys

def test_packages():
    """Test if all required packages can be imported"""
    packages = [
        "fastapi",
        "uvicorn",
        "python-multipart",
        "python-dotenv"
    ]
    
    # Optional packages (for AI features)
    optional_packages = [
        "langchain",
        "langchain_huggingface",
        "langchain_core",
        "pydantic"
    ]
    
    print("🧪 Testing Package Installation...")
    print("=" * 40)
    
    # Test required packages
    print("📦 Testing Required Packages:")
    for package in packages:
        try:
            __import__(package)
            print(f"✅ {package}")
        except ImportError as e:
            print(f"❌ {package}: {e}")
            return False
    
    # Test optional packages
    print("\n🤖 Testing Optional Packages (AI features):")
    optional_failures = 0
    for package in optional_packages:
        try:
            __import__(package)
            print(f"✅ {package}")
        except ImportError as e:
            print(f"⚠️  {package}: {e} (AI features will use fallback)")
            optional_failures += 1
    
    print(f"\n📊 Results:")
    print(f"✅ Required packages: {len(packages)}/{len(packages)}")
    print(f"🤖 Optional packages: {len(optional_packages) - optional_failures}/{len(optional_packages)}")
    
    if optional_failures == len(optional_packages):
        print("⚠️  All AI packages failed - will use fallback mode")
    elif optional_failures > 0:
        print("⚠️  Some AI packages failed - mixed mode")
    else:
        print("✅ All packages working - full AI features available")
    
    return True

if __name__ == "__main__":
    success = test_packages()
    sys.exit(0 if success else 1) 