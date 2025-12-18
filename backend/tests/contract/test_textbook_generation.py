"""
Contract test for POST /textbooks/generate endpoint
"""
import pytest
import requests
import uuid
from unittest.mock import patch, MagicMock

# Base URL for the API (should be configured based on environment)
BASE_URL = "http://localhost:8000/api"

def test_post_textbooks_generate_valid_request():
    """
    Test that POST /textbooks/generate returns 201 with valid request data
    """
    # Valid request payload
    payload = {
        "title": "Introduction to Physical AI",
        "description": "A comprehensive textbook on Physical AI and Robotics",
        "subject": "Physical AI & Humanoid Robotics",
        "educationalLevel": "intermediate",
        "language": "en",
        "topicOutline": "Chapter 1: Introduction to Physical AI; Chapter 2: Sensorimotor Learning; Chapter 3: Embodied Cognition",
        "learningObjectives": [
            "Understand fundamental concepts of Physical AI",
            "Learn about sensorimotor integration",
            "Explore applications in humanoid robotics"
        ],
        "chapterCount": 10,
        "includeExercises": True
    }

    # Mock the OpenAI API call to avoid actual API calls during testing
    with patch('backend.src.lib.openai') as mock_openai:
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "Generated textbook content..."
        mock_openai.chat.completions.create.return_value = mock_response

        response = requests.post(f"{BASE_URL}/textbook/generate", json=payload)

        # Assert the response status code is 201 (Created)
        assert response.status_code == 201

        # Assert the response contains the expected fields
        response_data = response.json()
        assert "id" in response_data
        assert "title" in response_data
        assert "status" in response_data
        assert "progress" in response_data
        assert "createdAt" in response_data
        assert "estimatedCompletionTime" in response_data

        # Assert the values are as expected
        assert response_data["title"] == payload["title"]
        assert response_data["status"] in ["pending", "processing", "completed", "failed"]
        assert 0 <= response_data["progress"] <= 100
        assert isinstance(uuid.UUID(response_data["id"]), uuid.UUID)


def test_post_textbooks_generate_missing_required_fields():
    """
    Test that POST /textbooks/generate returns 400 when required fields are missing
    """
    # Request payload missing required fields
    payload = {
        "title": "Incomplete Request",
        # Missing required fields: educationalLevel, topicOutline, learningObjectives
    }

    response = requests.post(f"{BASE_URL}/textbook/generate", json=payload)

    # Assert the response status code is 400 (Bad Request)
    assert response.status_code == 400

    # Assert the response contains error details
    response_data = response.json()
    assert "error" in response_data


def test_post_textbooks_generate_invalid_educational_level():
    """
    Test that POST /textbooks/generate returns 400 with invalid educational level
    """
    # Request payload with invalid educational level
    payload = {
        "title": "Invalid Level Textbook",
        "description": "Testing invalid educational level",
        "subject": "Physical AI & Humanoid Robotics",
        "educationalLevel": "invalid_level",  # Invalid value
        "language": "en",
        "topicOutline": "Test outline",
        "learningObjectives": ["Test objective"],
        "chapterCount": 10,
        "includeExercises": True
    }

    response = requests.post(f"{BASE_URL}/textbook/generate", json=payload)

    # Assert the response status code is 400 (Bad Request)
    assert response.status_code == 400

    # Assert the response contains error details
    response_data = response.json()
    assert "error" in response_data


def test_post_textbooks_generate_validates_topic_outline_length():
    """
    Test that POST /textbooks/generate validates topic outline minimum length
    """
    # Request payload with very short topic outline
    payload = {
        "title": "Short Outline Textbook",
        "description": "Testing short outline validation",
        "subject": "Physical AI & Humanoid Robotics",
        "educationalLevel": "beginner",
        "language": "en",
        "topicOutline": "Short",  # Too short (less than 10 chars)
        "learningObjectives": ["Test objective"],
        "chapterCount": 10,
        "includeExercises": True
    }

    response = requests.post(f"{BASE_URL}/textbook/generate", json=payload)

    # Assert the response status code is 400 (Bad Request)
    assert response.status_code == 400

    # Assert the response contains error details
    response_data = response.json()
    assert "error" in response_data


if __name__ == "__main__":
    # Run the tests
    test_post_textbooks_generate_valid_request()
    test_post_textbooks_generate_missing_required_fields()
    test_post_textbooks_generate_invalid_educational_level()
    test_post_textbooks_generate_validates_topic_outline_length()
    print("All contract tests for POST /textbooks/generate passed!")