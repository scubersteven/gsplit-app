"""
Guinness Split the G API
Flask API for scoring Guinness pints based on the "Split the G" technique.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
import os
import traceback
from pathlib import Path

from vision_processor import GuinnessVisionProcessor
from models import db, Pub, Score, PubRating
from config import Config

app = Flask(__name__)

# Load configuration
app.config.from_object(Config)

# Initialize database
db.init_app(app)
migrate = Migrate(app, db)

# Create tables (for first-time setup)
with app.app_context():
    db.create_all()

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


@app.route('/generate-pub-roast', methods=['POST'])
def generate_pub_roast():
    """
    Generate a pub roast - 80% pre-written, 20% AI-generated.

    Expects:
        JSON body with:
        - rating: float (0-5)
        - taste: float (0-5)
        - temperature: float (0-5)
        - head: float (0-5)
        - pub: string (pub name)

    Returns:
        JSON with 'roast' and 'is_ai_generated' keys
    """
    try:
        data = request.get_json()

        if not data or 'rating' not in data:
            return jsonify({'error': 'Missing rating parameter'}), 400

        rating = float(data['rating'])
        taste = data.get('taste', 3.0)
        temperature = data.get('temperature', 3.0)
        head = data.get('head', 3.0)
        pub = data.get('pub', '')

        roast_result = vision_processor.generate_pub_roast(
            rating, taste, temperature, head, pub
        )

        return jsonify(roast_result), 200

    except Exception as e:
        app.logger.error(f"Error generating pub roast: {str(e)}")
        return jsonify({
            'error': 'Failed to generate roast',
            'message': str(e)
        }), 500


@app.route('/api/pubs', methods=['GET'])
def get_pubs():
    """Get all pubs with aggregated data."""
    try:
        pubs = Pub.query.all()
        result = []

        for pub in pubs:
            # Get top split
            top_score = Score.query.filter_by(pub_id=pub.id)\
                .order_by(Score.score.desc()).first()

            # Get average rating
            ratings = PubRating.query.filter_by(pub_id=pub.id).all()
            avg_rating = None
            if ratings:
                avg_rating = sum(float(r.overall_rating) for r in ratings) / len(ratings)
                avg_rating = round(avg_rating, 1)

            # Get pints logged count
            pints_logged = Score.query.filter_by(pub_id=pub.id).count()

            # Get leaderboard (top 5)
            top_scores = Score.query.filter_by(pub_id=pub.id)\
                .order_by(Score.score.desc()).limit(5).all()
            leaderboard = [
                {
                    'rank': idx + 1,
                    'username': score.username or 'Anonymous',
                    'score': float(score.score)
                }
                for idx, score in enumerate(top_scores)
            ]

            pub_data = pub.to_dict()
            pub_data.update({
                'topSplit': {
                    'score': float(top_score.score),
                    'username': top_score.username or 'Anonymous'
                } if top_score else None,
                'qualityRating': avg_rating,
                'pintsLogged': pints_logged,
                'leaderboard': leaderboard
            })

            result.append(pub_data)

        return jsonify(result), 200
    except Exception as e:
        app.logger.error(f"Error fetching pubs: {str(e)}")
        return jsonify({'error': 'Failed to fetch pubs'}), 500


@app.route('/api/pubs/<place_id>', methods=['GET'])
def get_pub(place_id):
    """Get single pub with full details."""
    try:
        pub = Pub.query.filter_by(place_id=place_id).first()

        if not pub:
            return jsonify({'error': 'Pub not found'}), 404

        # Get leaderboard
        top_scores = Score.query.filter_by(pub_id=pub.id)\
            .order_by(Score.score.desc()).limit(10).all()
        leaderboard = [
            {
                'rank': idx + 1,
                'username': score.username or 'Anonymous',
                'score': float(score.score)
            }
            for idx, score in enumerate(top_scores)
        ]

        # Get ratings
        ratings = PubRating.query.filter_by(pub_id=pub.id).all()
        avg_rating = None
        stats = None
        if ratings:
            avg_rating = sum(float(r.overall_rating) for r in ratings) / len(ratings)

            # Calculate stats
            stats = {
                'taste': {
                    'average': round(sum(float(r.taste) for r in ratings) / len(ratings), 1),
                    'percentGood': round(len([r for r in ratings if float(r.taste) >= 4.0]) / len(ratings) * 100)
                },
                'temperature': {
                    'average': round(sum(float(r.temperature) for r in ratings) / len(ratings), 1),
                    'percentGood': round(len([r for r in ratings if float(r.temperature) >= 4.0]) / len(ratings) * 100)
                },
                'head': {
                    'average': round(sum(float(r.head) for r in ratings) / len(ratings), 1),
                    'percentGood': round(len([r for r in ratings if float(r.head) >= 4.0]) / len(ratings) * 100)
                }
            }

        pub_data = pub.to_dict()
        pub_data.update({
            'leaderboard': leaderboard,
            'qualityRating': round(avg_rating, 1) if avg_rating else None,
            'pintsLogged': len(leaderboard),
            'stats': stats
        })

        return jsonify(pub_data), 200
    except Exception as e:
        app.logger.error(f"Error fetching pub: {str(e)}")
        return jsonify({'error': 'Failed to fetch pub'}), 500


@app.route('/api/pubs', methods=['POST'])
def create_pub():
    """Create pub from Google Place data."""
    try:
        data = request.get_json()

        # Validate required fields
        required = ['place_id', 'name', 'address', 'lat', 'lng']
        if not all(field in data for field in required):
            return jsonify({'error': 'Missing required fields'}), 400

        # Check if pub already exists
        existing = Pub.query.filter_by(place_id=data['place_id']).first()
        if existing:
            return jsonify(existing.to_dict()), 200

        # Create new pub
        pub = Pub(
            place_id=data['place_id'],
            name=data['name'],
            address=data['address'],
            lat=data['lat'],
            lng=data['lng']
        )

        db.session.add(pub)
        db.session.commit()

        return jsonify(pub.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error creating pub: {str(e)}")
        return jsonify({'error': 'Failed to create pub'}), 500


@app.route('/api/pubs/<place_id>/scores', methods=['POST'])
def submit_score(place_id):
    """Submit G-Split score for a pub."""
    try:
        data = request.get_json()

        # Validate required fields
        required = ['score']
        if not all(field in data for field in required):
            return jsonify({'error': 'Missing required fields'}), 400

        # Get or create pub
        pub = Pub.query.filter_by(place_id=place_id).first()
        if not pub:
            # Create pub if it doesn't exist
            pub = Pub(
                place_id=place_id,
                name=data.get('pub_name', 'Unknown'),
                address=data.get('pub_address', ''),
                lat=data.get('pub_lat', 0),
                lng=data.get('pub_lng', 0)
            )
            db.session.add(pub)
            db.session.flush()

        # Create score
        score = Score(
            pub_id=pub.id,
            username=data.get('username'),
            anonymous_id=data.get('anonymous_id'),
            score=data['score'],
            split_image=data.get('split_image'),
            split_detected=data.get('split_detected', False),
            feedback=data.get('feedback'),
            ranking=data.get('ranking')
        )

        db.session.add(score)
        db.session.commit()

        return jsonify(score.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error submitting score: {str(e)}")
        return jsonify({'error': 'Failed to submit score'}), 500


@app.route('/api/pubs/<place_id>/ratings', methods=['POST'])
def submit_rating(place_id):
    """Submit survey rating for a pub."""
    try:
        data = request.get_json()

        # Validate required fields
        required = ['overall_rating', 'taste', 'temperature', 'head']
        if not all(field in data for field in required):
            return jsonify({'error': 'Missing required fields'}), 400

        # Get or create pub
        pub = Pub.query.filter_by(place_id=place_id).first()
        if not pub:
            pub = Pub(
                place_id=place_id,
                name=data.get('pub_name', 'Unknown'),
                address=data.get('pub_address', ''),
                lat=data.get('pub_lat', 0),
                lng=data.get('pub_lng', 0)
            )
            db.session.add(pub)
            db.session.flush()

        # Create rating
        rating = PubRating(
            pub_id=pub.id,
            username=data.get('username'),
            anonymous_id=data.get('anonymous_id'),
            overall_rating=data['overall_rating'],
            taste=data['taste'],
            temperature=data['temperature'],
            head=data['head'],
            price=data.get('price'),
            roast=data.get('roast')
        )

        db.session.add(rating)
        db.session.commit()

        return jsonify(rating.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error submitting rating: {str(e)}")
        return jsonify({'error': 'Failed to submit rating'}), 500


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
