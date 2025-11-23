"""
Example usage of the Guinness Split the G API

This script demonstrates how to interact with the API programmatically.
"""

import requests
import json
from pathlib import Path


def analyze_guinness_image(image_path, api_url="http://localhost:5000"):
    """
    Analyze a Guinness pint image using the API

    Args:
        image_path: Path to the image file
        api_url: Base URL of the API (default: http://localhost:5000)

    Returns:
        dict: Analysis results
    """
    endpoint = f"{api_url}/analyze-split"

    # Check if file exists
    if not Path(image_path).exists():
        print(f"Error: File not found: {image_path}")
        return None

    # Prepare the file for upload
    with open(image_path, 'rb') as image_file:
        files = {'image': image_file}

        # Make the request
        print(f"Analyzing: {image_path}")
        response = requests.post(endpoint, files=files)

    # Parse the response
    if response.status_code == 200:
        result = response.json()

        # Display results
        print("\n" + "="*60)
        print("ANALYSIS RESULTS")
        print("="*60)
        print(f"Score: {result['score']}/100")
        print(f"Distance from G-line: {result['distance_from_g_line_mm']}mm")
        print(f"Confidence: {result['confidence']:.2%}")
        print(f"\nFeedback: {result['feedback']}")

        # Show debug info if available
        if 'debug_info' in result:
            print("\n" + "-"*60)
            print("DEBUG INFORMATION")
            print("-"*60)
            for key, value in result['debug_info'].items():
                print(f"{key}: {value}")

        print("="*60 + "\n")

        return result
    else:
        # Handle errors
        error_data = response.json()
        print("\n" + "="*60)
        print("ERROR")
        print("="*60)
        print(f"Status Code: {response.status_code}")
        print(f"Error: {error_data.get('error', 'Unknown error')}")
        print(f"Message: {error_data.get('message', 'No message')}")
        print("="*60 + "\n")

        return None


def batch_analyze(image_paths, api_url="http://localhost:5000"):
    """
    Analyze multiple images and compare scores

    Args:
        image_paths: List of image file paths
        api_url: Base URL of the API

    Returns:
        list: List of results for each image
    """
    results = []

    print(f"\nAnalyzing {len(image_paths)} images...\n")

    for image_path in image_paths:
        result = analyze_guinness_image(image_path, api_url)
        if result:
            results.append({
                'image': image_path,
                'score': result['score'],
                'distance_mm': result['distance_from_g_line_mm'],
                'confidence': result['confidence']
            })

    # Display comparison
    if results:
        print("\n" + "="*60)
        print("COMPARISON")
        print("="*60)
        results_sorted = sorted(results, key=lambda x: x['score'], reverse=True)

        for i, r in enumerate(results_sorted, 1):
            print(f"{i}. {Path(r['image']).name}")
            print(f"   Score: {r['score']}/100 | Distance: {r['distance_mm']:+.1f}mm | Confidence: {r['confidence']:.2%}")

        print("="*60 + "\n")

    return results


def check_api_health(api_url="http://localhost:5000"):
    """
    Check if the API is running and healthy

    Args:
        api_url: Base URL of the API

    Returns:
        bool: True if healthy, False otherwise
    """
    try:
        response = requests.get(f"{api_url}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API is healthy: {data['service']} v{data['version']}")
            return True
        else:
            print(f"❌ API returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"❌ Could not connect to API at {api_url}")
        print("   Make sure the API is running (python app.py)")
        return False
    except Exception as e:
        print(f"❌ Error checking API health: {str(e)}")
        return False


# Example usage
if __name__ == "__main__":
    # First, check if API is running
    if not check_api_health():
        print("\nPlease start the API first:")
        print("  cd api")
        print("  python app.py")
        exit(1)

    print("\n" + "="*60)
    print("GUINNESS SPLIT THE G - API USAGE EXAMPLES")
    print("="*60)

    # Example 1: Analyze a single image
    print("\n📸 Example 1: Analyze a single image")
    print("-" * 60)
    print("Usage: analyze_guinness_image('path/to/image.jpg')")
    print("\nTo test, replace the path below with your image:")
    print("  result = analyze_guinness_image('test_images/guinness.jpg')")

    # Example 2: Batch analysis
    print("\n\n📸 Example 2: Batch analyze multiple images")
    print("-" * 60)
    print("Usage: batch_analyze(['image1.jpg', 'image2.jpg', ...])")
    print("\nTo test, replace with your images:")
    print("  results = batch_analyze([")
    print("      'test_images/pour1.jpg',")
    print("      'test_images/pour2.jpg',")
    print("      'test_images/pour3.jpg'")
    print("  ])")

    # Example 3: Using with custom API URL
    print("\n\n🌐 Example 3: Connect to remote API")
    print("-" * 60)
    print("Usage: analyze_guinness_image('image.jpg', 'http://api.example.com')")

    print("\n" + "="*60)
    print("\nFor more examples, see the README.md file")
    print("="*60 + "\n")
