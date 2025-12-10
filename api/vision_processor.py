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
from roast_bank import get_roast, get_ai_prompt

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class GuinnessVisionProcessor:
    """Computer vision processor using Roboflow Workflow."""

    # Roboflow Workflow configuration
    ROBOFLOW_API_KEY = "bYmwUIskucEFjoL01NF5"
    WORKSPACE_NAME = "gsplit-shaffer"
    WORKFLOW_ID = "shaffer"

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

            # Extract TWO model results (Model 3 removed in v9)
            # CRITICAL: Roboflow uses spaces in some keys, underscores in others
            pint_results = outputs.get('pint results', {})  # SPACE
            split_results_array = outputs.get('split_results', [])  # UNDERSCORE
            split_results = split_results_array[0] if split_results_array else {}

            print(f'--- Parsed Workflow Outputs ---')
            print(f'Pint results available: {bool(pint_results)}')
            print(f'Split results available: {bool(split_results)}')

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

                    # DEBUG: Save crop for diagnostic analysis
                    if os.getenv('SAVE_DEBUG_CROPS') == '1':
                        debug_dir = "/tmp/gsplit_crops"
                        os.makedirs(debug_dir, exist_ok=True)

                        # Extract image name from path
                        image_name = os.path.basename(image_path)
                        base_name = os.path.splitext(image_name)[0]

                        # Tag filename with crop source (Model_2 or Model_1)
                        source_tag = crop_info['source'].replace(' ', '_')

                        # Save crop
                        crop_path = f"{debug_dir}/{base_name}_{source_tag}_crop.jpg"
                        cv2.imwrite(crop_path, g_crop)

                        # Log crop metadata
                        height, width = g_crop.shape[:2] if len(g_crop.shape) >= 2 else (0, 0)
                        aspect_ratio = width / height if height > 0 else 0
                        print(f"DEBUG: Saved {source_tag} crop: {crop_path}")
                        print(f"       Size: {width}x{height} | Aspect: {aspect_ratio:.2f} | Source: {crop_info['source']}")

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

                    # DEBUG: Save crop for diagnostic analysis
                    if os.getenv('SAVE_DEBUG_CROPS') == '1':
                        debug_dir = "/tmp/gsplit_crops"
                        os.makedirs(debug_dir, exist_ok=True)

                        # Extract image name from path
                        image_name = os.path.basename(image_path)
                        base_name = os.path.splitext(image_name)[0]

                        # Tag filename with crop source (Model_2 or Model_1)
                        source_tag = crop_info['source'].replace(' ', '_')

                        # Save crop
                        crop_path = f"{debug_dir}/{base_name}_{source_tag}_crop.jpg"
                        cv2.imwrite(crop_path, g_crop)

                        # Log crop metadata
                        height, width = g_crop.shape[:2] if len(g_crop.shape) >= 2 else (0, 0)
                        aspect_ratio = width / height if height > 0 else 0
                        print(f"DEBUG: Saved {source_tag} crop: {crop_path}")
                        print(f"       Size: {width}x{height} | Aspect: {aspect_ratio:.2f} | Source: {crop_info['source']}")

            # Calculate score using v9 SIMPLIFIED SYSTEM (Model 2 + Model 1 fallback)
            score_result = self._calculate_score_from_workflow(
                split_results, pint_results, g_crop, crop_info, image_path
            )

            # Extract values from result dictionary
            score = score_result['score']
            distance_mm = score_result['distance_mm']
            split_detected = score_result['split_detected']

            # DEBUG: Save annotated crop with g-bar (green) and beer line (red)
            if os.getenv('SAVE_DEBUG_CROPS') == '1' and g_crop is not None:
                beer_line_y = score_result.get('beer_line_y')
                if beer_line_y is not None:
                    debug_dir = "/tmp/gsplit_crops"
                    image_name = os.path.basename(image_path)
                    base_name = os.path.splitext(image_name)[0]
                    source_tag = crop_info['source'].replace(' ', '_')

                    # Create annotated copy
                    annotated = g_crop.copy()
                    height, width = annotated.shape[:2] if len(annotated.shape) >= 2 else (0, 0)

                    if height > 0 and width > 0:
                        # Draw green line at y=0.5 (assumed g-bar position)
                        center_y = int(height * 0.5)
                        cv2.line(annotated, (0, center_y), (width, center_y), (0, 255, 0), 2)

                        # Draw red line at detected beer line position
                        beer_y = int(height * beer_line_y)
                        cv2.line(annotated, (0, beer_y), (width, beer_y), (0, 0, 255), 2)

                        # Save annotated crop
                        annotated_path = f"{debug_dir}/{base_name}_{source_tag}_annotated.jpg"
                        cv2.imwrite(annotated_path, annotated)
                        print(f"DEBUG: Saved annotated crop: {annotated_path}")
                        print(f"       Green line (g-bar @ 0.5): y={center_y} | Red line (beer): y={beer_y}")

            print(f'\n{"="*80}')
            print(f'=== FINAL SCORE CALCULATION ===')
            print(f'Score: {score}%')
            print(f'Split detected: {split_detected}')
            print(f'Distance: {distance_mm:.2f}mm')
            print(f'Model 2 available: {score_result["model2_available"]}')
            print(f'{"="*80}\n')

            # Save G-logo crop for Model 2 failed cases (for debugging)
            if g_crop is not None and not score_result['model2_available']:
                failed_crops_dir = '/Users/justinshaffer/Desktop/GSplit_Test_Results/failed_crops'
                os.makedirs(failed_crops_dir, exist_ok=True)

                base_name = os.path.splitext(os.path.basename(image_path))[0]
                crop_filename = f'{base_name}_crop.jpg'
                crop_path = os.path.join(failed_crops_dir, crop_filename)

                cv2.imwrite(crop_path, g_crop)
                print(f'💾 SAVED FAILED CROP: {crop_path}')
                print(f'   (Model 2 could not detect beer-split in this crop)\n')

            feedback = self._generate_feedback(distance_mm, score, split_detected)

            result = {
                'score': score,
                'distance_from_g_line_mm': round(distance_mm, 2),
                'g_line_detected': split_detected,
                'confidence': 0.95 if split_detected else 0.5,
                'feedback': feedback,
                # Debug fields
                'model2_available': score_result['model2_available'],
                'model3_fallback_used': score_result['model3_fallback_used'],
                'beer_line_in_zone': score_result['beer_line_in_zone'],
                'beer_line_y': score_result['beer_line_y'],
                'g_bar_y': score_result['g_bar_y'],
                'g_curve_y': score_result['g_curve_y'],
                'debug_crop_path': score_result['debug_crop_path'],
                # G-logo bbox from Model 1 (for diagnostic analysis)
                'g_logo_width': score_result.get('g_logo_width'),
                'g_logo_height': score_result.get('g_logo_height'),
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

    def _calculate_score_from_workflow(self, split_results: Dict, pint_results: Dict,
                                       g_crop: np.ndarray, crop_info: Dict, image_path: str) -> Dict:
        """v5 SIMPLIFIED SCORING: Binary multiplier + exponential decay."""

        # Extract Model 1 G-logo bbox for diagnostic analysis
        pint_predictions = pint_results.get('predictions', []) if pint_results else []
        g_logo_model1 = next((p for p in pint_predictions if p.get('class') in ['g-logo', 'G']), None)
        g_logo_width = g_logo_model1['width'] if g_logo_model1 else None
        g_logo_height_full = g_logo_model1['height'] if g_logo_model1 else None

        # v6: Use ALL Model 2 predictions (no confidence filter)
        split_predictions = split_results.get('predictions', [])
        model2_available = bool(split_predictions)

        if model2_available:
            # v9 DEAD SIMPLE: Distance from center
            img_height = split_results['image']['height']
            beer_split = split_predictions[0]

            # Step 1: Extract beer line top edge (normalized 0-1)
            beer_line_y = (beer_split['y'] - (beer_split['height'] / 2)) / img_height

            # Step 2: Calculate distance from center (0.5)
            distance = abs(beer_line_y - 0.5)

            # Step 3: Linear scoring, clamped to 50-100
            score = 100 - (distance * 100)
            score = max(50.0, min(100.0, score))

            distance_mm = distance * 100  # For API response

            print(f"  [v9] Beer line: {beer_line_y:.4f} | Distance: {distance:.4f} | Score: {score:.1f}%")

            # For backwards compatibility, set dummy values
            g_bar_y_normalized = 0.5
            g_curve_y_normalized = 0.5
            in_zone = (distance < 0.25)  # Within 25% of center

            # Debug visualization (keep existing)
            debug_crop_path = None
            if g_crop is not None:
                debug_crop_path = self._save_debug_visualization(
                    g_crop, beer_line_y * img_height,
                    0.5 * img_height,  # g_bar at center
                    0.5 * img_height,  # g_curve at center
                    distance_mm, img_height, image_path
                )

            return {
                'score': round(score, 1),
                'distance_mm': round(distance_mm, 2),
                'split_detected': in_zone,
                'model2_available': True,
                'model3_fallback_used': True,  # We don't use Model 3
                'beer_line_in_zone': in_zone,
                'beer_line_y': beer_line_y,
                'g_bar_y': 0.5,
                'g_curve_y': 0.5,
                'debug_crop_path': debug_crop_path,
                'g_logo_width': g_logo_width,
                'g_logo_height': g_logo_height_full
            }
        else:
            # Model 2 failed - return 25%
            return {
                'score': 25.0,
                'distance_mm': 50.0,
                'split_detected': False,
                'model2_available': False,
                'model3_fallback_used': False,
                'beer_line_in_zone': False,
                'beer_line_y': None,
                'g_bar_y': None,
                'g_curve_y': None,
                'debug_crop_path': None,
                'g_logo_width': g_logo_width,
                'g_logo_height': g_logo_height_full
            }

    def _save_debug_visualization(self, crop_image: np.ndarray, beer_line_y: float,
                                  g_bar_y: float, g_curve_y: float, distance_mm: float, img_height: int,
                                  original_filename: str) -> str:
        """
        Save annotated crop showing beer line, G-bar, and G-curve positions

        Args:
            crop_image: Cropped G-logo image
            beer_line_y: Y coordinate of beer line in crop
            g_bar_y: Y coordinate of G-bar in crop
            g_curve_y: Y coordinate of G-curve in crop
            distance_mm: Distance in millimeters
            img_height: Height of crop image
            original_filename: Original image filename for unique naming

        Returns:
            Full path to saved debug crop
        """
        annotated = crop_image.copy()
        height, width = annotated.shape[:2]

        # PRECISE, THIN LINES
        line_thickness = 1  # Thin, precise lines
        font_scale = 0.25   # Very small text
        font_thickness = 1
        font = cv2.FONT_HERSHEY_SIMPLEX

        # Draw G-CURVE line (CYAN) - MUST DRAW THIS!
        y_top = max(0, min(int(g_curve_y), height - 1))  # Clamp to image bounds [0, height-1]
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

        # Save to centralized location with original filename
        output_dir = '/Users/justinshaffer/Desktop/GSplit_Test_Results/debug_crops'
        os.makedirs(output_dir, exist_ok=True)

        # Extract base filename without extension
        base_name = os.path.splitext(os.path.basename(original_filename))[0]
        output_filename = f'{base_name}_debug.jpg'
        output_path = os.path.join(output_dir, output_filename)

        cv2.imwrite(output_path, annotated)

        print(f'📊 SAVED DEBUG VISUALIZATION: {output_path}')
        print(f'   🔵 Cyan line = G-curve (calculated)')
        print(f'   🔴 Red line = G-bar (Model 3)')
        print(f'   🟢 Green line = Beer line (Model 2)')
        print(f'   🟡 Yellow = Distance\n')

        return output_path

    def _generate_feedback(self, distance_mm: float, score: float, split_detected: bool) -> str:
        """
        Generate feedback - 80% pre-written, 20% AI-generated.
        """
        import random

        print(f'\n{"─"*80}')
        print(f'🎲 FEEDBACK GENERATION: Rolling for AI vs Pre-written')
        print(f'   Score: {score}%, Distance: {distance_mm:.1f}mm, Split: {split_detected}')

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

        # 80% chance: Use pre-written feedback from roast bank
        roast = get_roast(score, distance_mm)
        print(f'📝 Using pre-written feedback: "{roast}"')
        print(f'{"─"*80}\n')
        return roast

    def _generate_ai_feedback(self, score: float, distance_mm: float, split_detected: bool) -> str:
        """
        Call Claude API for dynamic feedback generation using new roast bank prompt.
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

            # Use centralized prompt from roast bank
            prompt = get_ai_prompt(score, distance_mm, split_detected)

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