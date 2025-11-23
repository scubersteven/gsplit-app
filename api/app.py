"""
Guinness Split the G API
Flask API for scoring Guinness pints based on the "Split the G" technique.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import traceback
from pathlib import Path

from vision_processor import GuinnessVisionProcessor

app = Flask(__name__)

# Configure CORS - Allow all origins for now (restrict in production)
CORS(app,
     origins="*",  # Allow all origins
     methods=['GET', 'POST', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'],
     max_age=3600)

# Configuration
UPLOAD_FOLDER = Path('uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Ensure upload folder exists
UPLOAD_FOLDER.mkdir(exist_ok=True)

# Initialize the vision processor
vision_processor = GuinnessVisionProcessor()


def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def validate_score(score, distance_mm, g_detected, confidence):
    """
    Catch only extreme outliers - main scoring handles the rest.

    Args:
        score: Raw score from vision processor (0-100)
        distance_mm: Distance from G-line in millimeters
        g_detected: Whether G-line was detected
        confidence: Model confidence (0-1)

    Returns:
        Validated score (float)
    """
    # Cap at 99.5% (reserve 99.6-100% for future "100 Club" unlock)
    if score > 99.5:
        return 99.5

    # If distance is EXTREME (>50mm = way off), something is broken
    if distance_mm > 50:
        return min(score, 40.0)

    # If confidence is VERY low (<0.4), small penalty
    if confidence < 0.4:
        return round(score * 0.95, 1)  # 5% penalty

    return round(score, 1)


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'service': 'guinness-split-scorer',
        'version': '1.0.0'
    }), 200


@app.route('/analyze-split', methods=['POST'])
def analyze_split():
    """
    Analyze a Guinness pint image and score based on the Split the G technique.

    Expects:
        - 'image' file in multipart/form-data

    Returns:
        JSON with score, distance from G-line, and detailed analysis
    """
    try:
        # Validate request has file
        if 'image' not in request.files:
            return jsonify({
                'error': 'No image file provided',
                'message': 'Please upload an image file with key "image"'
            }), 400

        file = request.files['image']

        # Validate filename exists
        if file.filename == '':
            return jsonify({
                'error': 'No file selected',
                'message': 'Please select a file to upload'
            }), 400

        # Validate file type
        if not allowed_file(file.filename):
            return jsonify({
                'error': 'Invalid file type',
                'message': f'Allowed file types: {", ".join(ALLOWED_EXTENSIONS)}'
            }), 400

        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = UPLOAD_FOLDER / filename
        file.save(str(filepath))

        try:
            # Process the image
            result = vision_processor.analyze_guinness_split(str(filepath))

            # Clean up uploaded file
            if filepath.exists():
                filepath.unlink()

            # Check if analysis was successful
            if 'error' in result:
                return jsonify(result), 400

            # Validate score to catch extreme outliers
            if 'score' in result:
                result['score'] = validate_score(
                    score=result['score'],
                    distance_mm=result.get('distance_from_g_line_mm', 999),
                    g_detected=result.get('g_line_detected', False),
                    confidence=result.get('confidence', 0.5)
                )

            return jsonify(result), 200

        except Exception as e:
            # Clean up on error
            if filepath.exists():
                filepath.unlink()
            raise e

    except Exception as e:
        error_trace = traceback.format_exc()
        app.logger.error(f"Error processing image: {error_trace}")

        return jsonify({
            'error': 'Processing error',
            'message': str(e),
            'details': error_trace if app.debug else None
        }), 500


@app.errorhandler(413)
def file_too_large(e):
    """Handle file size exceeded error."""
    return jsonify({
        'error': 'File too large',
        'message': f'Maximum file size is {MAX_FILE_SIZE // (1024 * 1024)}MB'
    }), 413


if __name__ == '__main__':
    # Run in debug mode for development
    app.run(host='0.0.0.0', port=5001, debug=True)
