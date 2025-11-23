"""
Test script for the Guinness Split the G API
"""

import requests
import json
from pathlib import Path


class GuinnessSplitTester:
    """Test client for the Guinness Split API"""

    def __init__(self, base_url="http://localhost:5000"):
        self.base_url = base_url

    def test_health(self):
        """Test the health check endpoint"""
        print("Testing health endpoint...")
        response = requests.get(f"{self.base_url}/health")

        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}\n")

        return response.status_code == 200

    def test_analyze_split(self, image_path):
        """
        Test the analyze-split endpoint with an image

        Args:
            image_path: Path to the test image
        """
        print(f"Testing analyze-split with image: {image_path}")

        if not Path(image_path).exists():
            print(f"❌ Error: Image file not found: {image_path}\n")
            return False

        try:
            with open(image_path, 'rb') as image_file:
                files = {'image': image_file}
                response = requests.post(
                    f"{self.base_url}/analyze-split",
                    files=files
                )

            print(f"Status Code: {response.status_code}")

            result = response.json()

            if response.status_code == 200:
                print("✅ Success!")
                print(f"\nScore: {result['score']}/100")
                print(f"Distance from G-line: {result['distance_from_g_line_mm']}mm")
                print(f"Confidence: {result['confidence']}")
                print(f"Feedback: {result['feedback']}")

                if 'debug_info' in result:
                    print("\nDebug Info:")
                    for key, value in result['debug_info'].items():
                        print(f"  {key}: {value}")
            else:
                print("❌ Error!")
                print(f"Error: {result.get('error', 'Unknown')}")
                print(f"Message: {result.get('message', 'No message')}")

            print()
            return response.status_code == 200

        except Exception as e:
            print(f"❌ Exception occurred: {str(e)}\n")
            return False

    def test_invalid_requests(self):
        """Test various invalid request scenarios"""
        print("Testing invalid request scenarios...")

        # Test 1: No file
        print("\n1. Testing request with no file...")
        response = requests.post(f"{self.base_url}/analyze-split")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        assert response.status_code == 400

        # Test 2: Invalid file type
        print("\n2. Testing request with invalid file type...")
        files = {'image': ('test.txt', b'This is not an image', 'text/plain')}
        response = requests.post(f"{self.base_url}/analyze-split", files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        assert response.status_code == 400

        print("\n✅ All invalid request tests passed!\n")
        return True


def main():
    """Run all tests"""
    print("=" * 60)
    print("Guinness Split the G API - Test Suite")
    print("=" * 60)
    print()

    tester = GuinnessSplitTester()

    # Test health endpoint
    print("=" * 60)
    tester.test_health()

    # Test invalid requests
    print("=" * 60)
    tester.test_invalid_requests()

    # Test with sample image (if provided)
    print("=" * 60)
    print("To test with an actual image, run:")
    print("  python test_api.py <path_to_guinness_image>")
    print()
    print("Example:")
    print("  python test_api.py test_images/guinness_perfect.jpg")
    print("=" * 60)


def test_with_image(image_path):
    """Test with a specific image"""
    tester = GuinnessSplitTester()
    tester.test_health()
    tester.test_analyze_split(image_path)


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        # Test with provided image
        image_path = sys.argv[1]
        test_with_image(image_path)
    else:
        # Run general tests
        main()
