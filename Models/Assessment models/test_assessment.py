#!/usr/bin/env python3
"""
Test script to verify assessment modules are working
"""
import os
import sys

def test_technical_assessment():
    """Test technical assessment module"""
    try:
        from technical_assessment import generate_technical_mcqs
        print("✅ Technical assessment module imported successfully")
        
        result = generate_technical_mcqs("Software Engineer", 3, "easy")
        print("✅ Technical assessment generated successfully")
        print(f"Result: {result}")
        return True
    except Exception as e:
        print(f"❌ Technical assessment failed: {e}")
        return False

def test_personality_assessment():
    """Test personality assessment module"""
    try:
        from personality_assessment import generate_personality_assessment
        print("✅ Personality assessment module imported successfully")
        
        result = generate_personality_assessment(3, "Work Style", "Software Engineer")
        print("✅ Personality assessment generated successfully")
        print(f"Result: {result}")
        return True
    except Exception as e:
        print(f"❌ Personality assessment failed: {e}")
        return False

def test_communication_test():
    """Test communication test module"""
    try:
        from communication_test import generate_communication_test
        print("✅ Communication test module imported successfully")
        
        result = generate_communication_test(3, "General")
        print("✅ Communication test generated successfully")
        print(f"Result: {result}")
        return True
    except Exception as e:
        print(f"❌ Communication test failed: {e}")
        return False

def test_general_aptitude():
    """Test general aptitude module"""
    try:
        from general_aptitude import generate_general_aptitude
        print("✅ General aptitude module imported successfully")
        
        result = generate_general_aptitude(3, "General")
        print("✅ General aptitude generated successfully")
        print(f"Result: {result}")
        return True
    except Exception as e:
        print(f"❌ General aptitude failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Assessment Modules...")
    print("=" * 50)
    
    tests = [
        test_technical_assessment,
        test_personality_assessment,
        test_communication_test,
        test_general_aptitude
    ]
    
    passed = 0
    for test in tests:
        if test():
            passed += 1
        print("-" * 30)
    
    print(f"\n📊 Test Results: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("✅ All assessment modules are working correctly!")
        return 0
    else:
        print("❌ Some assessment modules have issues.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 