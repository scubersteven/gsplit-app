"""
Test Suite for GSplit Scoring API
Runs real images through the scoring system to reveal actual behavior
"""

import requests
import os
from pathlib import Path
from tabulate import tabulate
import csv

# API endpoint
API_URL = 'http://localhost:5001/analyze-split'

# Test images directory
TEST_DIR = Path('/Users/justinshaffer/Desktop/Full pints')


def run_scoring_tests():
    """
    Load test images and run through scoring API.
    Print results table and save to CSV.
    """
    print("🔍 GSplit Scoring Test Suite")
    print("=" * 80)
    print(f"📂 Loading images from: {TEST_DIR}")
    print()

    # Check if test directory exists
    if not TEST_DIR.exists():
        print(f"❌ Error: Test directory not found: {TEST_DIR}")
        return

    # Find all image files
    image_extensions = ['*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG']
    image_files = []
    for ext in image_extensions:
        image_files.extend(TEST_DIR.glob(ext))

    if not image_files:
        print(f"❌ No images found in {TEST_DIR}")
        return

    print(f"📸 Found {len(image_files)} test images")
    print()

    # Test each image
    results = []
    for i, img_file in enumerate(sorted(image_files), 1):
        print(f"Testing {i}/{len(image_files)}: {img_file.name}...")

        try:
            # Call API
            with open(img_file, 'rb') as f:
                response = requests.post(
                    API_URL,
                    files={'image': f},
                    timeout=30
                )

            if response.status_code == 200:
                result = response.json()

                # Check for error in response
                if 'error' in result:
                    print(f"  ⚠️  API Error: {result['error']}")
                    results.append({
                        'filename': img_file.name,
                        'score': 'ERROR',
                        'distance_mm': 'N/A',
                        'confidence': 'N/A',
                        'split_detected': 'N/A',
                        'feedback': result.get('error', 'Unknown error')
                    })
                else:
                    print(f"  ✅ Score: {result.get('score', 'N/A')}%")
                    results.append({
                        'filename': img_file.name,
                        'score': result.get('score', 'N/A'),
                        'distance_mm': round(result.get('distance_from_g_line_mm', 0), 2),
                        'confidence': round(result.get('confidence', 0), 3),
                        'split_detected': '✅' if result.get('g_line_detected') else '❌',
                        'feedback': result.get('feedback', 'N/A')
                    })
            else:
                print(f"  ❌ HTTP {response.status_code}: {response.text[:100]}")
                results.append({
                    'filename': img_file.name,
                    'score': 'HTTP_ERROR',
                    'distance_mm': 'N/A',
                    'confidence': 'N/A',
                    'split_detected': 'N/A',
                    'feedback': f'HTTP {response.status_code}'
                })

        except requests.exceptions.ConnectionError:
            print(f"  ❌ Connection Error: Is the Flask server running on port 5001?")
            results.append({
                'filename': img_file.name,
                'score': 'CONN_ERROR',
                'distance_mm': 'N/A',
                'confidence': 'N/A',
                'split_detected': 'N/A',
                'feedback': 'Connection failed'
            })
        except Exception as e:
            print(f"  ❌ Error: {str(e)}")
            results.append({
                'filename': img_file.name,
                'score': 'EXCEPTION',
                'distance_mm': 'N/A',
                'confidence': 'N/A',
                'split_detected': 'N/A',
                'feedback': str(e)
            })

    print()
    print("=" * 80)
    print("📊 TEST RESULTS")
    print("=" * 80)
    print()

    # Print table
    print(tabulate(results, headers='keys', tablefmt='grid'))
    print()

    # Calculate statistics (only for successful tests)
    successful_results = [r for r in results if isinstance(r['score'], (int, float))]

    if successful_results:
        print("📈 STATISTICS")
        print("=" * 80)
        print(f"Total tests: {len(results)}")
        print(f"Successful: {len(successful_results)}")
        print(f"Failed: {len(results) - len(successful_results)}")
        print()

        scores = [r['score'] for r in successful_results]
        print(f"Average score: {sum(scores) / len(scores):.1f}%")
        print(f"Highest score: {max(scores)}%")
        print(f"Lowest score: {min(scores)}%")
        print()

        splits_detected = sum(1 for r in successful_results if r['split_detected'] == '✅')
        print(f"Splits detected: {splits_detected}/{len(successful_results)} ({splits_detected/len(successful_results)*100:.1f}%)")

    # Save to CSV
    csv_path = Path(__file__).parent / 'test_results.csv'
    with open(csv_path, 'w', newline='') as f:
        if results:
            writer = csv.DictWriter(f, fieldnames=results[0].keys())
            writer.writeheader()
            writer.writerows(results)

    print()
    print(f"💾 Results saved to: {csv_path}")
    print()


if __name__ == '__main__':
    run_scoring_tests()
