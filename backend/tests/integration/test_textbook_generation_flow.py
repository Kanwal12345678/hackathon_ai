"""
Integration test for textbook generation flow
Tests the complete flow from request to generation completion
"""
import pytest
import requests
import uuid
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta

# Base URL for the API (should be configured based on environment)
BASE_URL = "http://localhost:8000/api"

def test_textbook_generation_complete_flow():
    """
    Test the complete textbook generation flow:
    1. Create a generation request (POST /textbook/generate)
    2. Check the status (GET /textbook/{id})
    3. Verify the generated content
    """
    # Step 1: Create a textbook generation request
    payload = {
        "title": "Integration Test Textbook",
        "description": "A textbook for integration testing",
        "subject": "Physical AI & Humanoid Robotics",
        "educationalLevel": "intermediate",
        "language": "en",
        "topicOutline": "Chapter 1: Introduction; Chapter 2: Advanced Concepts; Chapter 3: Applications",
        "learningObjectives": [
            "Understand core concepts",
            "Apply advanced techniques",
            "Evaluate real-world applications"
        ],
        "chapterCount": 3,
        "includeExercises": True
    }

    # Mock the OpenAI API call and other services
    with patch('backend.src.lib.openai') as mock_openai, \
         patch('backend.src.prisma') as mock_prisma, \
         patch('backend.src.services.textbook_generation.textbook_generation_service') as mock_service:

        # Mock OpenAI response
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "# Chapter 1: Introduction\nContent for chapter 1..."
        mock_openai.chat.completions.create.return_value = mock_response

        # Mock database operations
        generated_id = str(uuid.uuid4())
        mock_prisma.textbook_generation_request.create.return_value = {
            "id": generated_id,
            "inputPrompt": payload["topicOutline"],
            "parameters": {
                "educationalLevel": payload["educationalLevel"],
                "language": payload["language"],
                "chapterCount": payload["chapterCount"]
            },
            "status": "processing",
            "progress": 0,
            "resultTextbookId": None,
            "userId": "test-user-id",
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }

        # Mock textbook creation
        mock_prisma.textbook.create.return_value = {
            "id": str(uuid.uuid4()),
            "title": payload["title"],
            "description": payload["description"],
            "subject": payload["subject"],
            "educationalLevel": payload["educationalLevel"],
            "language": payload["language"],
            "status": "complete",
            "progress": 100,
            "content": {
                "chapters": [
                    {
                        "id": str(uuid.uuid4()),
                        "title": "Chapter 1: Introduction",
                        "order": 1,
                        "content": "Content for chapter 1...",
                        "learningObjectives": [payload["learningObjectives"][0]],
                        "exercises": [
                            {
                                "id": str(uuid.uuid4()),
                                "question": "What is the main concept?",
                                "options": ["Option A", "Option B", "Option C", "Option D"],
                                "correctAnswer": "Option A",
                                "explanation": "Explanation here",
                                "difficulty": "medium"
                            }
                        ],
                        "summary": "Summary of chapter 1"
                    }
                ]
            },
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat(),
            "generatedAt": datetime.now().isoformat()
        }

        # Make the initial request to generate a textbook
        response = requests.post(f"{BASE_URL}/textbook/generate", json=payload)

        # Assert the initial request was successful
        assert response.status_code == 201
        response_data = response.json()
        assert "id" in response_data
        assert response_data["status"] in ["pending", "processing"]
        assert response_data["title"] == payload["title"]

        # Store the generated textbook ID for the next step
        textbook_id = response_data["id"]

        # Step 2: Check the status of the generation (this would normally be polled)
        # In a real integration test, we might need to wait or mock the async processing
        status_response = requests.get(f"{BASE_URL}/textbook/{textbook_id}")

        # The status might still be processing or could be complete depending on mock
        assert status_response.status_code in [200, 202]  # OK or Accepted
        status_data = status_response.json()
        assert "id" in status_data
        assert status_data["id"] == textbook_id
        assert "status" in status_data


def test_textbook_generation_with_customization():
    """
    Test textbook generation with customization options
    """
    payload = {
        "title": "Customized Textbook",
        "description": "A textbook with custom formatting",
        "subject": "Physical AI & Humanoid Robotics",
        "educationalLevel": "advanced",
        "language": "ur",  # Urdu language
        "topicOutline": "Advanced topics in Physical AI",
        "learningObjectives": ["Master advanced concepts"],
        "chapterCount": 5,
        "includeExercises": False  # No exercises
    }

    # Mock the services
    with patch('backend.src.lib.openai') as mock_openai, \
         patch('backend.src.prisma') as mock_prisma:

        # Mock OpenAI response
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "# Advanced Chapter\nAdvanced content..."
        mock_openai.chat.completions.create.return_value = mock_response

        # Mock database operations
        generated_id = str(uuid.uuid4())
        mock_prisma.textbook_generation_request.create.return_value = {
            "id": generated_id,
            "inputPrompt": payload["topicOutline"],
            "parameters": {
                "educationalLevel": payload["educationalLevel"],
                "language": payload["language"],
                "chapterCount": payload["chapterCount"],
                "includeExercises": payload["includeExercises"]
            },
            "status": "processing",
            "progress": 0,
            "resultTextbookId": None,
            "userId": "test-user-id",
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }

        mock_prisma.textbook.create.return_value = {
            "id": str(uuid.uuid4()),
            "title": payload["title"],
            "description": payload["description"],
            "subject": payload["subject"],
            "educationalLevel": payload["educationalLevel"],
            "language": payload["language"],
            "status": "complete",
            "progress": 100,
            "content": {
                "chapters": [
                    {
                        "id": str(uuid.uuid4()),
                        "title": "Advanced Topic",
                        "order": 1,
                        "content": "Advanced content...",
                        "learningObjectives": payload["learningObjectives"],
                        "exercises": [],  # No exercises as requested
                        "summary": "Summary of advanced topic"
                    }
                ]
            },
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat(),
            "generatedAt": datetime.now().isoformat()
        }

        # Make the request
        response = requests.post(f"{BASE_URL}/textbook/generate", json=payload)

        # Assert the request was successful
        assert response.status_code == 201
        response_data = response.json()
        assert response_data["title"] == payload["title"]
        assert response_data["status"] in ["pending", "processing"]


def test_textbook_generation_error_handling():
    """
    Test error handling in textbook generation flow
    """
    # Payload with invalid data
    invalid_payload = {
        "title": "Too Short",  # Valid
        "description": "A textbook with errors",
        "subject": "Physical AI & Humanoid Robotics",
        "educationalLevel": "invalid_level",  # Invalid educational level
        "language": "en",
        "topicOutline": "Short",  # Too short (less than 10 chars)
        "learningObjectives": [],  # Empty list
        "chapterCount": 10,
        "includeExercises": True
    }

    # Make the request with invalid data
    response = requests.post(f"{BASE_URL}/textbook/generate", json=invalid_payload)

    # Should return 400 for validation errors
    assert response.status_code == 400
    response_data = response.json()
    assert "error" in response_data


def test_textbook_generation_with_exercises():
    """
    Test textbook generation flow with exercises included
    """
    payload = {
        "title": "Textbook with Exercises",
        "description": "A textbook with exercises for practice",
        "subject": "Physical AI & Humanoid Robotics",
        "educationalLevel": "beginner",
        "language": "en",
        "topicOutline": "Basic concepts in Physical AI",
        "learningObjectives": [
            "Understand basic principles",
            "Identify key components"
        ],
        "chapterCount": 2,
        "includeExercises": True
    }

    # Mock the services
    with patch('backend.src.lib.openai') as mock_openai, \
         patch('backend.src.prisma') as mock_prisma:

        # Mock OpenAI response
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "# Chapter 1\nContent with exercises..."
        mock_openai.chat.completions.create.return_value = mock_response

        # Mock database operations
        generated_id = str(uuid.uuid4())
        mock_prisma.textbook_generation_request.create.return_value = {
            "id": generated_id,
            "inputPrompt": payload["topicOutline"],
            "parameters": {
                "educationalLevel": payload["educationalLevel"],
                "language": payload["language"],
                "chapterCount": payload["chapterCount"],
                "includeExercises": payload["includeExercises"]
            },
            "status": "processing",
            "progress": 0,
            "resultTextbookId": None,
            "userId": "test-user-id",
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }

        mock_prisma.textbook.create.return_value = {
            "id": str(uuid.uuid4()),
            "title": payload["title"],
            "description": payload["description"],
            "subject": payload["subject"],
            "educationalLevel": payload["educationalLevel"],
            "language": payload["language"],
            "status": "complete",
            "progress": 100,
            "content": {
                "chapters": [
                    {
                        "id": str(uuid.uuid4()),
                        "title": "Chapter 1: Basic Concepts",
                        "order": 1,
                        "content": "Basic content...",
                        "learningObjectives": payload["learningObjectives"],
                        "exercises": [
                            {
                                "id": str(uuid.uuid4()),
                                "question": "What is Physical AI?",
                                "options": ["Option A", "Option B", "Option C", "Option D"],
                                "correctAnswer": "Option A",
                                "explanation": "Explanation for Physical AI",
                                "difficulty": "easy"
                            }
                        ],
                        "summary": "Summary of basic concepts"
                    }
                ]
            },
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat(),
            "generatedAt": datetime.now().isoformat()
        }

        # Make the request
        response = requests.post(f"{BASE_URL}/textbook/generate", json=payload)

        # Assert the request was successful
        assert response.status_code == 201
        response_data = response.json()
        assert response_data["title"] == payload["title"]
        assert response_data["status"] in ["pending", "processing"]


if __name__ == "__main__":
    # Run the tests
    test_textbook_generation_complete_flow()
    test_textbook_generation_with_customization()
    test_textbook_generation_error_handling()
    test_textbook_generation_with_exercises()
    print("All integration tests for textbook generation flow passed!")