import os
import re
import requests
from pathlib import Path

IMAGE_ROOT = "/Users/justinshaffer/Desktop/Full pints"
API_URL = "http://localhost:5001/analyze-split"
OUTPUT_FILE = "/Users/justinshaffer/Desktop/GSplit_Test_Results/v9_comparison.txt"

def extract_competitor_score(filename):
    """Extract competitor score from filename like '82.4again.jpg' -> 82.4"""
    # Match patterns like: 82.4, 96.4.score, 97 again, etc.
    match = re.match(r'^(\d+(?:\.\d+)?)', filename)
    if match:
        return float(match.group(1))
    return None

def main():
    print("=" * 80)
    print("v9 FULL COMPARISON TEST")
    print("=" * 80)
    print(f"Scanning: {IMAGE_ROOT}")

    os.makedirs("/Users/justinshaffer/Desktop/GSplit_Test_Results", exist_ok=True)

    # Find all images
    all_images = []
    for ext in ['*.jpg', '*.jpeg', '*.png']:
        all_images.extend(Path(IMAGE_ROOT).rglob(ext))

    print(f"Found {len(all_images)} total images")

    # Filter to images with competitor scores in filename
    results = []
    skipped = []

    for img_path in sorted(all_images):
        img_name = img_path.name
        competitor_score = extract_competitor_score(img_name)

        if competitor_score is None:
            skipped.append(img_name)
            continue

        print(f"\nProcessing: {img_name} (competitor: {competitor_score}%)")

        # Call API
        try:
            with open(img_path, 'rb') as f:
                response = requests.post(API_URL, files={'image': f}, timeout=30)

            if response.status_code == 200:
                result = response.json()
                our_score = result.get('score', 0)
                model2_available = result.get('model2_available', False)

                difference = our_score - competitor_score

                results.append({
                    'filename': img_name,
                    'competitor_score': competitor_score,
                    'our_score': our_score,
                    'difference': difference,
                    'abs_difference': abs(difference),
                    'model2_available': model2_available
                })

                print(f"  Our score: {our_score}% | Diff: {difference:+.1f}% | Model 2: {model2_available}")
            else:
                print(f"  ✗ API ERROR: {response.status_code}")
                skipped.append(img_name)
        except Exception as e:
            print(f"  ✗ EXCEPTION: {str(e)}")
            skipped.append(img_name)

    # Sort by absolute difference (worst first)
    results.sort(key=lambda x: x['abs_difference'], reverse=True)

    # Calculate statistics
    if results:
        avg_difference = sum(r['difference'] for r in results) / len(results)
        avg_abs_difference = sum(r['abs_difference'] for r in results) / len(results)
        model2_success_rate = sum(1 for r in results if r['model2_available']) / len(results) * 100

        # Count by difference buckets
        excellent = [r for r in results if r['abs_difference'] < 5]
        good = [r for r in results if 5 <= r['abs_difference'] < 10]
        moderate = [r for r in results if 10 <= r['abs_difference'] < 25]
        poor = [r for r in results if 25 <= r['abs_difference'] < 50]
        terrible = [r for r in results if r['abs_difference'] >= 50]

        # Write report
        with open(OUTPUT_FILE, 'w') as f:
            f.write("=" * 80 + "\n")
            f.write("v9 FULL COMPARISON REPORT\n")
            f.write("=" * 80 + "\n\n")

            f.write(f"Total images analyzed: {len(results)}\n")
            f.write(f"Images skipped: {len(skipped)}\n")
            f.write(f"Model 2 success rate: {model2_success_rate:.1f}%\n\n")

            f.write(f"Average difference: {avg_difference:+.2f}%\n")
            f.write(f"Average absolute difference: {avg_abs_difference:.2f}%\n\n")

            f.write("DISTRIBUTION:\n")
            f.write(f"  Excellent (<5% diff):  {len(excellent):3d} ({len(excellent)/len(results)*100:.1f}%)\n")
            f.write(f"  Good (5-10% diff):     {len(good):3d} ({len(good)/len(results)*100:.1f}%)\n")
            f.write(f"  Moderate (10-25% diff): {len(moderate):3d} ({len(moderate)/len(results)*100:.1f}%)\n")
            f.write(f"  Poor (25-50% diff):    {len(poor):3d} ({len(poor)/len(results)*100:.1f}%)\n")
            f.write(f"  Terrible (>50% diff):  {len(terrible):3d} ({len(terrible)/len(results)*100:.1f}%)\n\n")

            f.write("=" * 80 + "\n\n")

            # Top 10 worst performers
            f.write("TOP 10 WORST PERFORMERS:\n")
            f.write("-" * 80 + "\n")
            for i, r in enumerate(results[:10], 1):
                f.write(f"{i:2d}. {r['filename']}\n")
                f.write(f"    Competitor: {r['competitor_score']:.1f}% | Our: {r['our_score']:.1f}% | ")
                f.write(f"Diff: {r['difference']:+.1f}% | Model 2: {r['model2_available']}\n")

            f.write("\n" + "=" * 80 + "\n\n")

            # Top 10 best performers (closest to competitor)
            f.write("TOP 10 BEST PERFORMERS (Closest to Competitor):\n")
            f.write("-" * 80 + "\n")
            best = sorted(results, key=lambda x: x['abs_difference'])[:10]
            for i, r in enumerate(best, 1):
                f.write(f"{i:2d}. {r['filename']}\n")
                f.write(f"    Competitor: {r['competitor_score']:.1f}% | Our: {r['our_score']:.1f}% | ")
                f.write(f"Diff: {r['difference']:+.1f}% | Model 2: {r['model2_available']}\n")

            f.write("\n" + "=" * 80 + "\n\n")

            # All results sorted by filename
            f.write("ALL RESULTS (Alphabetical):\n")
            f.write("-" * 80 + "\n")
            for r in sorted(results, key=lambda x: x['filename']):
                f.write(f"{r['filename']:30s} | Comp: {r['competitor_score']:5.1f}% | ")
                f.write(f"Our: {r['our_score']:5.1f}% | Diff: {r['difference']:+6.1f}% | ")
                f.write(f"M2: {'Y' if r['model2_available'] else 'N'}\n")

            if skipped:
                f.write("\n" + "=" * 80 + "\n\n")
                f.write("SKIPPED IMAGES (No competitor score in filename):\n")
                f.write("-" * 80 + "\n")
                for img in sorted(skipped):
                    f.write(f"  {img}\n")

        print(f"\n✓ Report saved: {OUTPUT_FILE}")

        # Print summary to console
        print("\n" + "=" * 80)
        print("SUMMARY")
        print("=" * 80)
        print(f"Total images: {len(results)}")
        print(f"Model 2 success rate: {model2_success_rate:.1f}%")
        print(f"Average difference: {avg_difference:+.2f}%")
        print(f"Average absolute difference: {avg_abs_difference:.2f}%")
        print()
        print("Distribution:")
        print(f"  Excellent (<5%):    {len(excellent):3d} ({len(excellent)/len(results)*100:.1f}%)")
        print(f"  Good (5-10%):       {len(good):3d} ({len(good)/len(results)*100:.1f}%)")
        print(f"  Moderate (10-25%):  {len(moderate):3d} ({len(moderate)/len(results)*100:.1f}%)")
        print(f"  Poor (25-50%):      {len(poor):3d} ({len(poor)/len(results)*100:.1f}%)")
        print(f"  Terrible (>50%):    {len(terrible):3d} ({len(terrible)/len(results)*100:.1f}%)")
        print()
        print("Top 3 Worst:")
        for i, r in enumerate(results[:3], 1):
            print(f"  {i}. {r['filename']}: {r['difference']:+.1f}% diff")
        print()
        print("Top 3 Best:")
        for i, r in enumerate(best[:3], 1):
            print(f"  {i}. {r['filename']}: {r['difference']:+.1f}% diff")
    else:
        print("\n⚠ No results collected")

if __name__ == '__main__':
    main()
