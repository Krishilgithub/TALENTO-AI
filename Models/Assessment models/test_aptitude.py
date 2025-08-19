#!/usr/bin/env python3

import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Test the general aptitude function directly
from general_aptitude import generate_aptitude_mcqs

def test_aptitude_generation():
    print("Testing general aptitude question generation...")
    print("=" * 50)
    
    # Test with minimal parameters
    result = generate_aptitude_mcqs("Software Engineer", 2, "moderate")
    
    print(f"Status: {result.get('status', 'unknown')}")
    print(f"Job Role: {result.get('job_role', 'unknown')}")
    print(f"Total Questions: {result.get('total_questions', 'unknown')}")
    print(f"Difficulty: {result.get('difficulty', 'unknown')}")
    print()
    
    if result.get('status') == 'success':
        print("✅ SUCCESS: AI model generated questions!")
        print("Generated Questions:")
        print(result.get('questions', 'No questions found'))
    elif result.get('status') == 'fallback':
        print("⚠️  FALLBACK: Using pre-defined questions")
        questions = result.get('questions', [])
        for i, q in enumerate(questions, 1):
            print(f"Q{i}: {q.get('question', 'No question')}")
    elif result.get('status') == 'error':
        print("❌ ERROR:")
        print(result.get('error', 'Unknown error'))
    
    print("=" * 50)

if __name__ == "__main__":
    test_aptitude_generation()
