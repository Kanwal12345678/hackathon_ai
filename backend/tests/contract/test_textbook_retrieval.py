"""
Contract test for GET /textbooks/{id} endpoint
"""
import pytest
import requests
import uuid
from unittest.mock import patch, MagicMock

# Base URL for the API (should be configured based on environment)
BASE_URL = "http://localhost:8000/api"

def test_get_textbooks_by_id_valid_id():
    """
    Test that GET /textbooks/{id} returns 200 with valid textbook ID
    """
    # Use a valid UUID for testing
    textbook_id = str(uuid.uuid4())

    # Mock the database query to return a textbook
    with patch('backend.src.prisma') as mock_prisma:
        mock_textbook = {
            "id": textbook_id,
            "title": "Test Textbook",
            "description": "A test textbook",
            "subject": "Physical AI & Humanoid Robotics",
            "educationalLevel": "intermediate",
            "language": "en",
            "status": "complete",
            "progress": 100,
            "content": {
                "chapters": [
                    {
                        "id": str(uuid.uuid4()),
                        "title": "Chapter 1",
                        "order": 1,
                        "content": "This is the content of chapter 1",
                        "learningObjectives": ["Objective 1", "Objective 2"],
                        "exercises": [
                            {
                                "id": str(uuid.uuid4()),
                                "question": "What is Physical AI?",
                                "options": ["Option A", "Option B", "Option C", "Option D"],
                                "correctAnswer": "Option A",
                                "explanation": "Explanation for the answer",
                                "difficulty": "medium"
                            }
                        ],
                        "summary": "Summary of chapter 1"
                    }
                ]
            },
            "createdAt": "2023-12-17T10:00:00Z",
            "updatedAt": "2023-12-17T11:00:00Z",
            "generatedAt": "2023-12-17T11:00:00Z"
        }

        mock_prisma.textbook.find_unique.return_value = mock_textbook

        response = requests.get(f"{BASE_URL}/textbook/{textbook_id}")

        # Assert the response status code is 200 (OK)
        assert response.status_code == 200

        # Assert the response contains the expected fields
        response_data = response.json()
        assert "id" in response_data
        assert "title" in response_data
        assert "status" in response_data
        assert "progress" in response_data
        assert "content" in response_data
        assert "createdAt" in response_data
        assert "updatedAt" in response_data

        # Assert the values are as expected
        assert response_data["id"] == textbook_id
        assert response_data["title"] == "Test Textbook"
        assert response_data["status"] in ["draft", "generating", "complete", "failed"]
        assert 0 <= response_data["progress"] <= 100
        assert isinstance(response_data["content"], dict)
        assert "chapters" in response_data["content"]


def test_get_textbooks_by_id_invalid_id_format():
    """
    Test that GET /textbooks/{id} returns 400 with invalid ID format
    """
    # Use an invalid ID format
    invalid_id = "invalid-uuid-format"

    response = requests.get(f"{BASE_URL}/textbook/{invalid_id}")

    # Assert the response status code is 400 (Bad Request) or 404 (Not Found)
    assert response.status_code in [400, 404]

    # Assert the response contains error details
    response_data = response.json()
    assert "error" in response_data


def test_get_textbooks_by_id_nonexistent():
    """
    Test that GET /textbooks/{id} returns 404 when textbook doesn't exist
    """
    # Use a valid UUID format but for a non-existent textbook
    nonexistent_id = str(uuid.uuid4())

    # Mock the database query to return None (not found)
    with patch('backend.src.prisma') as mock_prisma:
        mock_prisma.textbook.find_unique.return_value = None

        response = requests.get(f"{BASE_URL}/textbook/{nonexistent_id}")

        # Assert the response status code is 404 (Not Found)
        assert response.status_code == 404

        # Assert the response contains error details
        response_data = response.json()
        assert "error" in response_data


def test_get_textbooks_by_id_validates_uuid_format():
    """
    Test that GET /textbooks/{id} properly validates UUID format
    """
    # Use various invalid formats
    invalid_formats = [
        "not-a-uuid",
        "12345",  # Too short
        "12345678-1234-1234-1234-123456789abc-extra",  # Too long
        "12345678-1234-1234-1234-123456789abg",  # Invalid character (g)
    ]

    for invalid_id in invalid_formats:
        response = requests.get(f"{BASE_URL}/textbook/{invalid_id}")

        # Should return 400 for invalid format
        assert response.status_code in [400, 404], f"Failed for ID: {invalid_id}"

        # Response should contain error details
        response_data = response.json()
        assert "error" in response_data


if __name__ == "__main__":
    # Run the tests
    test_get_textbooks_by_id_valid_id()
    test_get_textbooks_by_id_invalid_id_format()
    test_get_textbooks_by_id_nonexistent()
    test_get_textbooks_by_id_validates_uuid_format()
    print("All contract tests for GET /textbooks/{id} passed!")