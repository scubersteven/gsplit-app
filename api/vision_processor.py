"""
Computer Vision Module for Guinness Split the G Analysis
Uses Roboflow Workflow via direct HTTP API calls.
THREE-MODEL SYSTEM: Model 1 (Pint), Model 2 (Beer Line), Model 3 (G-bar)
"""

import cv2
import numpy as np
import requests
import base64
from typing import Dict
import logging
from datetime import datetime
import os
import glob
import math

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class GuinnessVisionProcessor:
    """Computer vision processor using Roboflow Workflow."""

    # Roboflow Workflow configuration
    ROBOFLOW_API_KEY = "bYmwUIskucEFjoL01NF5"
    WORKSPACE_NAME = "gsplit-shaffer"
    WORKFLOW_ID = "shaffer"

    # Feedback library for 80% pre-written responses
    FEEDBACK_LIBRARY = {
        (95, 100): [
            "Perfect split. Absolute cinema 🎯",
            "GG. You actually did it ⚡",
            "That's the one",
            "Now that's a pour",
            "Can't argue with perfection 💯"
        ],
        (90, 94): [
            "Close but no cigar. Story of your life? 🎪",
            "Almost had it. Almost",
            "So close it hurts",
            "Nearly perfect. Nearly",
            "Just shy of greatness"
        ],
        (85, 89): [
            "Mid. But respectable mid 👍",
            "Decent. Nothing to write home about",
            "Not bad for a first attempt",
            "You're learning. Slowly",
            "Fair effort"
        ],
        (78, 84): [
            "Getting there. Emphasis on 'getting' 💡",
            "Room for improvement is an understatement 📝",
            "You tried. Gold star",
            "Better than nothing",
            "Keep at it"
        ],
        (73, 77): [
            "Bold of you to call that a split",
            "Swing and a miss, chief 📉",
            "Were you even looking? 🤔",
            "That's... one way to do it",
            "Points for confidence"
        ],
        (70, 72): [
            "Yikes. Just yikes 😬",
            "That's rough, mate",
            "Were you distracted?",
            "Practice. Lots of practice needed ⏰",
            "Bold attempt. Very bold"
        ],
        (45, 69): [
            "Were you aiming for the harp? 🔍",
            "No split visible. Try again",
            "That's not even close",
            "Maybe next time",
            "Did you aim at all?"
        ],
        (20, 44): [
            "This needs work. Serious work",
            "Have you considered practicing?",
            "Back to basics",
            "We all start somewhere. You started here",
            "Rough attempt"
        ],
        (0, 19): [
            "What just happened?",
            "Did you close your eyes?",
            "Unserious behavior",
            "Try again. Actually try this time",
            "That's certainly a choice"
        ]
    }

    # Pub roast library for 80% pre-written responses
    PUB_ROAST_LIBRARY = {
        'top': [
            "Found your local",
            "Tell no one about this place",
            "This pub gets it",
            "Marry the barman",
            "Certified haunt 🏠",
        ],
        'solid': [
            "Decent spot",
            "Would drink again",
            "No complaints",
            "Gets the job done",
            "Safe bet 👍",
        ],
        'mid': [
            "It's a pub",
            "Meh",
            "Nothing to write home about",
            "You've had better",
            "Mid tier establishment",
        ],
        'rough': [
            "Questionable choices were made",
            "Why did you stay",
            "Tourist trap energy",
            "Your standards have dropped",
            "That's on you",
        ],
        'bottom': [
            "Never again",
            "Report this establishment",
            "A crime scene",
            "Who recommended this",
            "Arthur weeps",
        ],
    }

    def __init__(self):
        """Initialize the vision processor."""
        self.debug_mode = True

    def analyze_guinness_split(self, image_path: str) -> Dict:
        """
        Main analysis function using Roboflow Workflow.

        Args:
            image_path: Path to the image file

        Returns:
            Dictionary with score and analysis details
        """
        try:
            print(f'\n{"="*80}')
            print(f'=== VISION PROCESSOR: analyze_guinness_split ===')
            print(f'Timestamp: {datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]}')
            print(f'{"="*80}')
            print(f'Image path: {image_path}')

            # Load image to verify
            image = cv2.imread(image_path)
            if image is None:
                print(f'ERROR: Failed to load image from {image_path}')
                return {'error': 'Failed to load image'}

            print(f'Image loaded successfully: shape={image.shape}')

            # Encode image to base64
            with open(image_path, 'rb') as f:
                image_data = base64.b64encode(f.read()).decode('utf-8')

            # Call Roboflow Workflow
            print(f'\n{"="*80}')
            print(f'=== CALLING ROBOFLOW WORKFLOW ===')
            print(f'Workspace: {self.WORKSPACE_NAME}')
            print(f'Workflow ID: {self.WORKFLOW_ID}')
            print(f'{"="*80}\n')

            url = f"https://detect.roboflow.com/infer/workflows/{self.WORKSPACE_NAME}/{self.WORKFLOW_ID}"

            payload = {
                "api_key": self.ROBOFLOW_API_KEY,
                "inputs": {
                    "image": {
                        "type": "base64",
                        "value": image_data
                    }
                }
            }

            response = requests.post(url, json=payload)

            if response.status_code != 200:
                print(f'ERROR: Workflow API call failed: {response.status_code}')
                print(f'Response: {response.text}')
                return {'error': f'Workflow API failed: {response.status_code}'}

            workflow_result = response.json()

            # Print full workflow response for debugging
            print(f'\n{"="*80}')
            print(f'=== WORKFLOW FULL RESPONSE ===')
            import json
            print(json.dumps(workflow_result, indent=2, default=str))
            print(f'{"="*80}\n')

            # Parse workflow outputs
            if 'outputs' in workflow_result and isinstance(workflow_result['outputs'], list):
                outputs = workflow_result['outputs'][0]
            else:
                outputs = workflow_result

            # Extract ALL THREE model results
            # CRITICAL: Roboflow uses spaces in some keys, underscores in others
            pint_results = outputs.get('pint results', {})  # SPACE
            split_results_array = outputs.get('split_results', [])  # UNDERSCORE
            split_results = split_results_array[0] if split_results_array else {}
            g_bar_results_array = outputs.get('g bar results', [])  # SPACE
            g_bar_results = g_bar_results_array[0] if g_bar_results_array else {}

            print(f'--- Parsed Workflow Outputs ---')
            print(f'Pint results available: {bool(pint_results)}')
            print(f'Split results available: {bool(split_results)}')
            print(f'G-bar results available: {bool(g_bar_results)}')

            # ALWAYS CROP G-LOGO USING MODEL 1 (for debugging all cases)
            g_crop = None
            crop_info = None

            # First, try to use Model 2's crop coordinates (most precise)
            if split_results and 'predictions' in split_results and len(split_results['predictions']) > 0:
                pred = split_results['predictions'][0]
                parent_origin = pred.get('parent_origin', {})

                if parent_origin:
                    offset_x = parent_origin['offset_x']
                    offset_y = parent_origin['offset_y']
                    crop_width = split_results['image']['width']
                    crop_height = split_results['image']['height']

                    # Crop the G-logo from original image
                    g_crop = image[
                        offset_y:offset_y + crop_height,
                        offset_x:offset_x + crop_width
                    ]

                    crop_info = {
                        'offset_x': offset_x,
                        'offset_y': offset_y,
                        'width': crop_width,
                        'height': crop_height,
                        'source': 'Model 2'
                    }

                    print(f'\n{"─"*80}')
                    print(f'📸 G-LOGO CROP (Model 2 coordinates)')
                    print(f'   Crop size: {crop_width}x{crop_height} pixels')
                    print(f'   Crop offset: ({offset_x}, {offset_y})')
                    print(f'{"─"*80}\n')

            # Fallback: Use Model 1's G-logo detection to crop (for Tier 2 cases)
            if g_crop is None and pint_results and 'predictions' in pint_results:
                pint_predictions = pint_results.get('predictions', [])
                g_logo_pint = None

                for pred in pint_predictions:
                    if pred.get('class') in ['g-logo', 'G']:
                        g_logo_pint = pred
                        break

                if g_logo_pint:
                    img_height = pint_results['image']['height']
                    img_width = pint_results['image']['width']

                    # Get G-logo bounding box from Model 1
                    g_x = g_logo_pint['x']
                    g_y = g_logo_pint['y']
                    g_width = g_logo_pint['width']
                    g_height = g_logo_pint['height']

                    # Calculate crop coordinates (with padding)
                    padding = 20
                    offset_x = max(0, int(g_x - g_width/2) - padding)
                    offset_y = max(0, int(g_y - g_height/2) - padding)
                    crop_width = min(int(g_width) + 2*padding, img_width - offset_x)
                    crop_height = min(int(g_height) + 2*padding, img_height - offset_y)

                    # Crop the G-logo
                    g_crop = image[
                        offset_y:offset_y + crop_height,
                        offset_x:offset_x + crop_width
                    ]

                    crop_info = {
                        'offset_x': offset_x,
                        'offset_y': offset_y,
                        'width': crop_width,
                        'height': crop_height,
                        'source': 'Model 1',
                        'g_logo_full_image': g_logo_pint  # Store for coordinate transformation
                    }

                    print(f'\n{"─"*80}')
                    print(f'📸 G-LOGO CROP (Model 1 coordinates - Tier 2 fallback)')
                    print(f'   Crop size: {crop_width}x{crop_height} pixels')
                    print(f'   Crop offset: ({offset_x}, {offset_y})')
                    print(f'{"─"*80}\n')

            # Save crop to disk for debugging
            if g_crop is not None:
                os.makedirs('debug_crops', exist_ok=True)
                crop_filename = f'debug_crops/g_crop_{datetime.now().strftime("%Y%m%d_%H%M%S")}.jpg'
                cv2.imwrite(crop_filename, g_crop)
                print(f'   Saved to: {crop_filename}\n')

            # Calculate score using THREE-MODEL SYSTEM
            score, distance_mm, split_detected = self._calculate_score_from_workflow(
                split_results, g_bar_results, pint_results, g_crop, crop_info
            )

            print(f'\n{"="*80}')
            print(f'=== FINAL SCORE CALCULATION ===')
            print(f'Score: {score}%')
            print(f'Split detected: {split_detected}')
            print(f'Distance: {distance_mm:.2f}mm')
            print(f'{"="*80}\n')

            feedback = self._generate_feedback(distance_mm, score, split_detected)

            result = {
                'score': score,
                'distance_from_g_line_mm': round(distance_mm, 2),
                'g_line_detected': split_detected,
                'confidence': 0.95 if split_detected else 0.5,
                'feedback': feedback,
                'debug_info': {
                    'workflow_outputs': outputs,
                    'split_detected': split_detected
                }
            }

            print(f'=== ANALYSIS COMPLETE ===')
            print(f'Final result: {result}\n')

            return result

        except Exception as e:
            print(f'\n{"="*80}')
            print(f'=== EXCEPTION in analyze_guinness_split ===')
            print(f'Error: {str(e)}')
            print(f'{"="*80}\n')
            import traceback
            traceback.print_exc()
            logger.error(f"Error in analyze_guinness_split: {str(e)}", exc_info=True)
            return {'error': 'Analysis failed', 'message': str(e)}

    def _calculate_score_from_workflow(self, split_results: Dict, g_bar_results: Dict, pint_results: Dict,
                                       g_crop: np.ndarray, crop_info: Dict) -> tuple:
        """
        Calculate score using THREE-MODEL SYSTEM.
        - Model 2: Beer line detection
        - Model 3: G-bar detection
        - Model 1: Fallback for TIER 2

        Args:
            split_results: Model 2 results (beer-split detection)
            g_bar_results: Model 3 results (G-bar detection)
            pint_results: Model 1 results (pint-level, coarse)
            g_crop: Cropped G-logo image (for annotation)
            crop_info: Crop coordinates and metadata

        Tier 1 (Split Detected): 75-100% with linear decay
        Tier 2 (No Split): 0-75% with quadratic decay
        """
        print(f'\n{"="*80}')
        print(f'=== SCORE CALCULATION (Three-Model System) ===')
        print(f'{"="*80}\n')

        # Check if split was detected in Model 2
        split_predictions = split_results.get('predictions', [])

        print(f'--- Checking for Split Detection ---')
        print(f'Split predictions count: {len(split_predictions)}')

        # Look for beer-split class in predictions
        beer_split = None
        
        for pred in split_predictions:
            class_name = pred.get('class', '')
            print(f'  Found class: "{class_name}" (confidence: {pred.get("confidence", 0):.4f})')

            if class_name in ['beer-split', 'split']:
                beer_split = pred
                print(f'    → Identified as BEER-SPLIT')

        # TIER 1: Split detected (75-100% range) - USE MODEL 2 + MODEL 3
        if beer_split:
            print(f'\n{"─"*80}')
            print(f'✓ TIER 1: SPLIT DETECTED - Using Model 2 + Model 3 (75-100%)')
            print(f'{"─"*80}\n')

            # Get crop dimensions
            img_height = split_results.get('image', {}).get('height', 1)
            img_width = split_results.get('image', {}).get('width', 1)

            # ===== MODEL 2: BEER LINE =====
            split_y = beer_split['y']
            split_height = beer_split['height']
            beer_line_y_pixel = split_y - (split_height / 2)  # Top edge of bounding box
            beer_line_normalized = beer_line_y_pixel / img_height

            print(f'🟢 MODEL 2 - Beer line:')
            print(f'  Y center: {split_y:.2f} px')
            print(f'  Height: {split_height:.2f} px')
            print(f'  Top edge (beer line): {beer_line_y_pixel:.2f} px')
            print(f'  Normalized: {beer_line_normalized:.6f}\n')

            # ===== MODEL 3: G-BAR =====
            g_bar_predictions = g_bar_results.get('predictions', [])
            g_bar = None
            
            for pred in g_bar_predictions:
                if pred.get('class') in ['g-bar', 'gbar', 'G-bar']:
                    g_bar = pred
                    break

            g_bar_y_normalized = None
            g_bar_y_pixel = None

            if g_bar:
                g_bar_y = g_bar['y']
                g_bar_height = g_bar['height']
                g_bar_y_pixel = g_bar_y - (g_bar_height / 2)  # Top edge
                g_bar_y_normalized = g_bar_y_pixel / img_height
                
                print(f'🔴 MODEL 3 - G-bar detected:')
                print(f'  Y center: {g_bar_y:.2f} px')
                print(f'  Height: {g_bar_height:.2f} px')
                print(f'  Top edge (G-bar): {g_bar_y_pixel:.2f} px')
                print(f'  Normalized: {g_bar_y_normalized:.6f}')
                print(f'  Confidence: {g_bar.get("confidence", 0):.4f}\n')
            else:
                # Fallback if Model 3 failed
                g_bar_y_normalized = 0.42
                g_bar_y_pixel = g_bar_y_normalized * img_height
                print(f'⚠️  MODEL 3 FAILED - Using fallback G-bar position: {g_bar_y_normalized:.6f}\n')

            # ===== CALCULATE G-TOP (TIP OF G) =====
            # The true split zone is from the very tip of the G down to the G-bar
            # G-top is approximately 0.18 (18% of G-logo height) above the G-bar
            G_TOP_OFFSET = 0.18  # Distance from G-bar to G-tip
            g_top_y_pixel_raw = g_bar_y_pixel - (G_TOP_OFFSET * img_height)
            g_top_y_pixel = max(0, g_top_y_pixel_raw)  # Clamp to prevent negative (out of bounds)
            g_top_normalized = g_top_y_pixel / img_height

            print(f'🔵 G-TOP CALCULATION (True Split Zone):')
            print(f'  G-bar position: {g_bar_y_pixel:.2f} px ({g_bar_y_normalized:.6f})')
            print(f'  G-top offset: {G_TOP_OFFSET} ({G_TOP_OFFSET * img_height:.2f} px)')
            print(f'  G-top position (raw): {g_top_y_pixel_raw:.2f} px')
            print(f'  G-top position (clamped): {g_top_y_pixel:.2f} px ({g_top_normalized:.6f})')
            if g_top_y_pixel_raw < 0:
                print(f'  ⚠️  WARNING: G-top calculated outside image bounds! Clamped to 0')
            print(f'  TRUE SPLIT ZONE: {g_top_normalized:.6f} to {g_bar_y_normalized:.6f}\n')

            # ===== CALCULATE DISTANCE =====
            distance_from_center = abs(beer_line_normalized - g_bar_y_normalized)
            
            print(f'--- Distance Calculation ---')
            print(f'Beer line: {beer_line_normalized:.6f}')
            print(f'G-bar:     {g_bar_y_normalized:.6f}')
            print(f'Distance:  {distance_from_center:.6f}')

            # Normalize distance (max distance is 0.5 from center to edge)
            normalized_distance = min(distance_from_center / 0.5, 1.0)
            distance_mm = normalized_distance * 50

            print(f'Normalized distance: {normalized_distance:.6f}')
            print(f'Distance in mm: {distance_mm:.6f}mm')

            # Save debug visualization using passed crop
            if g_crop is not None:
                self._save_debug_visualization(
                    g_crop,
                    beer_line_y_pixel,
                    g_bar_y_pixel,
                    g_top_y_pixel,
                    distance_mm,
                    img_height
                )

            # ===== CALCULATE BASE SCORE FROM DISTANCE =====
            # This applies to EVERYONE - inside or outside the zone
            # Uses exponential decay: closer = better
            decay_rate = 1.0  # Softer penalties for smoother scoring progression
            base_score = 100 * math.exp(-normalized_distance * decay_rate)

            print(f'\n--- Base Score Calculation ---')
            print(f'Distance: {distance_mm:.1f}mm')
            print(f'Normalized distance: {normalized_distance:.6f}')
            print(f'Base score (before bonus): {base_score:.1f}%\n')

            # ===== SMOOTH TAPERING BONUS =====
            # Bonus gradually increases from 10mm to 20mm to avoid scoring inversions
            # < 10mm: No bonus (already scoring 82-100%)
            # 10-20mm: Bonus ramps up linearly from 0% to 100%
            # >= 20mm: Full bonus applies

            bonus = 0

            if g_top_normalized <= beer_line_normalized <= g_bar_y_normalized:
                # ===== INSIDE THE TRUE SPLIT ZONE =====
                # Now check if far enough away to benefit from bonus

                # Calculate distance factor (smooth tapering from 10mm to 20mm)
                if distance_mm < 10:
                    # Too close - already scoring 82-100%, no bonus needed
                    distance_factor = 0
                    print(f'✓ Inside split zone but distance < 10mm')
                    print(f'  No bonus needed - already scoring high\n')

                elif distance_mm <= 20:
                    # Tapering zone: bonus gradually increases
                    # 10mm = 0%, 15mm = 50%, 20mm = 100%
                    distance_factor = (distance_mm - 10) / 10.0  # Linear ramp: 0 → 1

                    # Calculate base bonus (13-18% range based on centering)
                    zone_center = (g_top_normalized + g_bar_y_normalized) / 2
                    distance_from_center = abs(beer_line_normalized - zone_center)
                    zone_radius = (g_bar_y_normalized - g_top_normalized) / 2
                    centering_quality = max(0, 1.0 - (distance_from_center / zone_radius))

                    # Base bonus: 13% at edges, 18% at center
                    base_bonus = 13 + (5 * centering_quality)

                    # Apply distance tapering
                    bonus = base_bonus * distance_factor

                    print(f'🎯 TAPERING BONUS APPLIED!')
                    print(f'   Beer line is inside zone: {g_top_normalized:.3f} to {g_bar_y_normalized:.3f}')
                    print(f'   Distance from G-bar: {distance_mm:.1f}mm')
                    print(f'   Distance factor: {distance_factor:.1%} (10mm=0%, 20mm=100%)')
                    print(f'   Centering quality: {centering_quality:.1%}')
                    print(f'   Base bonus (if at 20mm+): {base_bonus:.1f}%')
                    print(f'   Applied bonus: +{bonus:.1f}%\n')

                else:
                    # 20mm+ - full bonus applies
                    zone_center = (g_top_normalized + g_bar_y_normalized) / 2
                    distance_from_center = abs(beer_line_normalized - zone_center)
                    zone_radius = (g_bar_y_normalized - g_top_normalized) / 2
                    centering_quality = max(0, 1.0 - (distance_from_center / zone_radius))

                    # Full bonus: 13% at edges, 18% at center
                    bonus = 13 + (5 * centering_quality)

                    print(f'🎯 FULL BONUS APPLIED!')
                    print(f'   Beer line is inside zone: {g_top_normalized:.3f} to {g_bar_y_normalized:.3f}')
                    print(f'   Distance from G-bar: {distance_mm:.1f}mm (>= 20mm)')
                    print(f'   Centering quality: {centering_quality:.1%}')
                    print(f'   Bonus: +{bonus:.1f}%\n')

            else:
                # ===== OUTSIDE THE SPLIT ZONE =====
                # No bonus regardless of distance
                if beer_line_normalized < g_top_normalized:
                    print(f'✗ Outside zone: Beer line too HIGH (above G-top)')
                    print(f'  Beer: {beer_line_normalized:.3f} < G-top: {g_top_normalized:.3f}')
                else:
                    print(f'✗ Outside zone: Beer line too LOW (below G-bar)')
                    print(f'  Beer: {beer_line_normalized:.3f} > G-bar: {g_bar_y_normalized:.3f}')
                print(f'  No bonus - base score only\n')

            # ===== FINAL SCORE =====
            score = base_score + bonus

            # Cap at 100% but NO FLOOR - let bad pours score bad
            score = min(score, 100.0)

            print(f'--- Final Score ---')
            print(f'Base: {base_score:.1f}%')
            print(f'Bonus: +{bonus:.1f}%')
            print(f'Final: {score:.1f}%')
            print(f'Formula: 100 × exp(-{normalized_distance:.6f} × {decay_rate}) + {bonus:.1f}%\n')

            print(f'\n{"="*80}')
            print(f'✓ SPLIT DETECTED - SCORE = {score:.1f}%')
            print(f'{"="*80}\n')

            # Return score with 1 decimal place precision
            return round(score, 1), round(distance_mm, 2), True

        # TIER 2: No split detected (0-45% range) - USE COARSE MODEL 1
        else:
            print(f'\n{"─"*80}')
            print(f'✗ TIER 2: NO SPLIT - Using quadratic decay (0-45% MAX)')
            print(f'{"─"*80}\n')
            print(f'⚠️  NOTE: No split detected = Model 1 measurements only (less precise)')
            print(f'   Maximum possible score capped at 45%\n')

            # Use pint-level detections for rough scoring
            pint_predictions = pint_results.get('predictions', [])

            beer = None
            g_logo_pint = None

            for pred in pint_predictions:
                class_name = pred.get('class', '')
                if class_name == 'beer':
                    beer = pred
                elif class_name in ['g-logo', 'G']:
                    g_logo_pint = pred

            if not beer or not g_logo_pint:
                print(f'Missing beer or G-logo in pint detection')
                print(f'Returning minimum score: 10.0%')
                return 10.0, 50.0, False

            # Calculate rough distance (NOTE: Model 1 is imprecise)
            img_height = pint_results.get('image', {}).get('height', 1)

            beer_top = (beer['y'] - beer['height']/2) / img_height
            g_center = g_logo_pint['y'] / img_height

            distance = abs(beer_top - g_center)
            distance_mm = distance * 200  # Approximate

            print(f'Beer top (Model 1, imprecise): {beer_top:.6f}')
            print(f'G center (normalized): {g_center:.6f}')
            print(f'Distance: {distance:.6f}')
            print(f'Distance in mm: ~{distance_mm:.0f}mm (approximate)')

            # Quadratic decay with 45% MAX CAP: score = 45 * (1 - normalized_distance)²
            max_score = 45  # Hard cap - no split = max 45%
            max_distance = 0.5  # Maximum reasonable distance
            normalized_distance = min(distance / max_distance, 1.0)

            score = max_score * pow(1 - normalized_distance, 2)

            print(f'\nFormula: score = {max_score} × (1 - {normalized_distance:.6f})²')
            print(f'Result: score = {score:.6f}% (full precision)')

            # Round to 1 decimal place for final score
            score = round(score, 1)

            print(f'Final score: {score}% (capped at {max_score}% max for no split)')

            # Save debug visualization for Tier 2 using Model 1 measurements
            if g_crop is not None and crop_info is not None:
                print(f'\n📊 TIER 2 - Creating annotation with Model 1 measurements (approximate)')

                # Transform Model 1's beer position from full image to crop coordinates
                # Beer position in full image
                pint_img_height = pint_results['image']['height']
                beer_top_pixel_full = beer_top * pint_img_height

                # Transform to crop coordinates
                offset_y = crop_info['offset_y']
                crop_height = crop_info['height']
                beer_line_y_pixel_crop = beer_top_pixel_full - offset_y

                # Use Model 1's G-logo center as approximate G-bar position
                # G-logo center in full image
                g_center_pixel_full = g_center * pint_img_height

                # Transform to crop coordinates
                g_bar_y_pixel_crop = g_center_pixel_full - offset_y

                # Calculate approximate G-top using 0.18 offset
                G_TOP_OFFSET = 0.18
                g_top_y_pixel_crop = g_bar_y_pixel_crop - (G_TOP_OFFSET * crop_height)

                print(f'   Beer line (Model 1): {beer_line_y_pixel_crop:.1f}px in crop')
                print(f'   G-bar approx: {g_bar_y_pixel_crop:.1f}px in crop')
                print(f'   G-top approx: {g_top_y_pixel_crop:.1f}px in crop')
                print(f'   ⚠️  Note: These are APPROXIMATE positions from Model 1\n')

                # Call debug visualization with approximate measurements
                self._save_debug_visualization(
                    g_crop,
                    beer_line_y_pixel_crop,
                    g_bar_y_pixel_crop,
                    g_top_y_pixel_crop,
                    distance_mm,
                    crop_height
                )
            else:
                print(f'\n📊 TIER 2 - No G-logo crop available for annotation')
                print(f'   Model 1 detected: Beer at {beer_top:.3f}, G at {g_center:.3f}')
                print(f'   Distance: {distance_mm:.2f}mm\n')

            print(f'\n{"="*80}')
            print(f'✗ NO SPLIT - SCORE = {score}%')
            print(f'{"="*80}\n')

            return score, distance_mm, False

    def _save_debug_visualization(self, crop_image: np.ndarray, beer_line_y: float,
                                  g_bar_y: float, g_top_y: float, distance_mm: float, img_height: int):
        """Save annotated crop showing beer line, G-bar, and G-top positions"""
        annotated = crop_image.copy()
        height, width = annotated.shape[:2]

        # PRECISE, THIN LINES
        line_thickness = 1  # Thin, precise lines
        font_scale = 0.25   # Very small text
        font_thickness = 1
        font = cv2.FONT_HERSHEY_SIMPLEX

        # Draw G-TOP line (CYAN) - MUST DRAW THIS!
        y_top = max(0, min(int(g_top_y), height - 1))  # Clamp to image bounds [0, height-1]
        cv2.line(annotated, (0, y_top), (width, y_top), (255, 255, 0), line_thickness)
        cv2.putText(annotated, 'TOP', (2, max(y_top - 2, 8)), font, font_scale, (255, 255, 0), font_thickness)

        # Draw G-BAR line (RED)
        y_bar = int(g_bar_y)
        cv2.line(annotated, (0, y_bar), (width, y_bar), (0, 0, 255), line_thickness)
        cv2.putText(annotated, 'BAR', (2, y_bar - 2), font, font_scale, (0, 0, 255), font_thickness)

        # Draw BEER LINE (GREEN)
        y_beer = int(beer_line_y)
        cv2.line(annotated, (0, y_beer), (width, y_beer), (0, 255, 0), line_thickness)
        cv2.putText(annotated, 'BEER', (2, y_beer - 2), font, font_scale, (0, 255, 0), font_thickness)

        # Distance indicator (YELLOW) - also thinner
        mid_x = width // 2
        cv2.line(annotated, (mid_x, y_beer), (mid_x, y_bar), (0, 255, 255), 1)
        cv2.putText(annotated, f'{distance_mm:.0f}mm', (mid_x + 2, (y_beer + y_bar) // 2),
                    font, 0.22, (0, 255, 255), 1)

        # Save
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_path = f'debug_annotated/annotated_{timestamp}.jpg'
        cv2.imwrite(output_path, annotated)

        print(f'📊 SAVED DEBUG VISUALIZATION: {output_path}')
        print(f'   🔵 Cyan line = G-top (calculated)')
        print(f'   🔴 Red line = G-bar (Model 3)')
        print(f'   🟢 Green line = Beer line (Model 2)')
        print(f'   🟡 Yellow = Distance\n')

    def _generate_feedback(self, distance_mm: float, score: float, split_detected: bool) -> str:
        """
        Generate feedback - 80% pre-written, 20% AI-generated.
        """
        import random

        print(f'\n{"─"*80}')
        print(f'🎲 FEEDBACK GENERATION: Rolling for AI vs Pre-written')
        print(f'   Score: {score}%, Distance: {distance_mm:.1f}mm, Split: {split_detected}')

        # Find appropriate feedback range
        feedback_options = []
        for (min_score, max_score), messages in self.FEEDBACK_LIBRARY.items():
            if min_score <= score <= max_score:
                feedback_options = messages
                break

        # Default if no range found
        if not feedback_options:
            feedback_options = ["That's a pour"]

        # 20% chance: Call Claude API for fresh roast
        roll = random.random()
        print(f'   Random roll: {roll:.4f} (need < 0.2 for AI)')

        if roll < 0.2:
            print(f'🤖 AI FEEDBACK TRIGGERED! Calling Claude API...')
            try:
                ai_feedback = self._generate_ai_feedback(score, distance_mm, split_detected)
                if ai_feedback:
                    print(f'✅ Using AI-generated feedback')
                    print(f'{"─"*80}\n')
                    return ai_feedback
                else:
                    print(f'⚠️  AI returned None, falling back to pre-written')
            except Exception as e:
                print(f"❌ AI feedback exception: {e}")
                import traceback
                traceback.print_exc()

        # 80% chance: Use pre-written feedback
        selected = random.choice(feedback_options)
        print(f'📝 Using pre-written feedback: "{selected}"')
        print(f'{"─"*80}\n')
        return selected

    def _generate_ai_feedback(self, score: float, distance_mm: float, split_detected: bool) -> str:
        """
        Call Claude API for dynamic feedback generation.
        """
        print(f'\n   🔑 _generate_ai_feedback() called')

        try:
            import anthropic
            import os

            # Get API key from environment variable
            api_key = os.environ.get("ANTHROPIC_API_KEY")
            api_key_present = bool(api_key)
            api_key_preview = f"{api_key[:15]}..." if api_key else "None"

            print(f'   🔐 API Key check:')
            print(f'      Present: {api_key_present}')
            print(f'      Preview: {api_key_preview}')

            if not api_key:
                print("   ❌ ANTHROPIC_API_KEY not set in environment, skipping AI feedback")
                return None

            print(f'   ✅ API key found, initializing Anthropic client...')
            client = anthropic.Anthropic(api_key=api_key)

            prompt = f"""You're The Digital Barman - sharp, witty, internet-savvy. Judge this Guinness pour:

Score: {score}%
Distance from G-bar: {distance_mm:.1f}mm
Split detected: {split_detected}

Generate ONE punchy roast/compliment (max 12 words). Be sharp and clever, not try-hard. Use an emoji only if it makes sense with what you said.

Examples of your style:
- "Perfect split. Absolute cinema 🎯"
- "Close but no cigar. Story of your life?"
- "Were you even looking? 🤔"
- "Yikes. Just yikes 😬"

Your response:"""

            print(f'   📡 Calling Claude Sonnet 4 API...')
            message = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=50,
                messages=[{"role": "user", "content": prompt}]
            )

            feedback = message.content[0].text.strip()
            print(f'   ✨ AI response received: "{feedback}"')
            return feedback

        except Exception as e:
            print(f"   ❌ AI feedback error: {type(e).__name__}: {e}")
            import traceback
            traceback.print_exc()
            return None

    def generate_pub_roast(self, rating: float, taste: float,
                           temperature: float, head: float, pub: str) -> Dict:
        """
        Generate pub roast - 80% pre-written, 20% AI-generated.

        Args:
            rating: Overall rating (0-5)
            taste: Taste rating (0-5)
            temperature: Temperature rating (0-5)
            head: Head rating (0-5)
            pub: Pub name

        Returns:
            Dictionary with 'roast' and 'is_ai_generated' keys
        """
        import random

        print(f'\n{"─"*80}')
        print(f'🍺 PUB ROAST GENERATION: Rolling for AI vs Pre-written')
        print(f'   Rating: {rating}/5, Pub: {pub}')

        # Determine tier
        if rating >= 4.5:
            tier = 'top'
        elif rating >= 3.5:
            tier = 'solid'
        elif rating >= 2.5:
            tier = 'mid'
        elif rating >= 1.5:
            tier = 'rough'
        else:
            tier = 'bottom'

        roast_options = self.PUB_ROAST_LIBRARY[tier]

        # 20% chance: Call Claude API
        roll = random.random()
        print(f'   Random roll: {roll:.4f} (need < 0.2 for AI)')

        if roll < 0.2:
            print(f'🤖 AI ROAST TRIGGERED! Calling Claude API...')
            try:
                ai_roast = self._generate_ai_pub_roast(
                    rating, taste, temperature, head, pub, tier
                )
                if ai_roast:
                    print(f'✅ Using AI-generated roast')
                    print(f'{"─"*80}\n')
                    return {
                        'roast': ai_roast,
                        'is_ai_generated': True
                    }
                else:
                    print(f'⚠️  AI returned None, falling back to pre-written')
            except Exception as e:
                print(f"❌ AI roast exception: {e}")

        # 80% chance: Use pre-written
        selected = random.choice(roast_options)
        print(f'📝 Using pre-written roast: "{selected}"')
        print(f'{"─"*80}\n')
        return {
            'roast': selected,
            'is_ai_generated': False
        }

    def _generate_ai_pub_roast(self, rating: float, taste: float,
                               temperature: float, head: float,
                               pub: str, tier: str) -> str:
        """
        Call Claude API for dynamic pub roast generation.
        """
        print(f'\n   🔑 _generate_ai_pub_roast() called')

        try:
            import anthropic
            import os

            api_key = os.environ.get("ANTHROPIC_API_KEY")

            if not api_key:
                print("   ❌ ANTHROPIC_API_KEY not set in environment")
                return None

            print(f'   ✅ API key found, initializing Anthropic client...')
            client = anthropic.Anthropic(api_key=api_key)

            ratings_context = f"""Overall: {rating}/5 stars
Taste: {taste}/5
Temperature: {temperature}/5
Head: {head}/5"""

            prompt = f"""You're The Digital Barman - sharp, witty, brutally honest. Judge this pub experience:

{ratings_context}
Pub: {pub}
Tier: {tier}

Generate ONE punchy roast/compliment about the pub (max 8 words). Match the {tier} tier vibe - be authentic and sharp, not forced. Use an emoji only if it fits naturally.

Your style examples:
- Top tier: "Found your local" / "This pub gets it"
- Solid: "Decent spot" / "Would drink again"
- Mid: "It's a pub" / "Nothing special"
- Rough: "Tourist trap energy" / "Why did you stay"
- Bottom: "Never again" / "A crime scene"

Your response:"""

            print(f'   📡 Calling Claude Sonnet 4 API...')
            message = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=30,
                messages=[{"role": "user", "content": prompt}]
            )

            roast = message.content[0].text.strip()
            print(f'   ✨ AI response received: "{roast}"')
            return roast

        except Exception as e:
            print(f"   ❌ AI roast error: {type(e).__name__}: {e}")
            return None