# Guinness Split the G API - Project Summary

## Overview

A complete Flask-based REST API that uses computer vision to score Guinness pints based on the "Split the G" technique. The API analyzes photos to determine how accurately the foam/liquid boundary aligns with the horizontal crossbar of the "G" in the Guinness harp logo.

## Project Structure

```
api/
├── __init__.py              # Package initialization
├── app.py                   # Main Flask application
├── vision_processor.py      # Computer vision module
├── config.py                # Configuration management
│
├── requirements.txt         # Python dependencies
├── .gitignore              # Git ignore rules
├── .env.example            # Environment variables template
│
├── README.md               # Main documentation
├── API_REFERENCE.md        # Complete API documentation
├── DEPLOYMENT.md           # Deployment guide
├── PROJECT_SUMMARY.md      # This file
│
├── test_api.py             # API testing script
├── example_usage.py        # Usage examples
│
├── Dockerfile              # Docker image configuration
├── docker-compose.yml      # Docker Compose setup
└── start.sh                # Quick start script
```

## Core Features

### 1. Computer Vision Analysis ✨

- **Glass Detection**: Identifies Guinness glass using edge detection and contour analysis
- **G-line Detection**: Locates the horizontal crossbar of the "G" in the harp logo
- **Foam Boundary Detection**: Identifies the foam/liquid boundary line
- **Distance Calculation**: Measures vertical distance between G-line and foam boundary
- **Calibration**: Automatically calibrates pixel-to-millimeter ratio based on glass size

### 2. Precision Scoring System 🎯

- Score range: 0-100
- Smooth interpolation between scoring thresholds
- Distance-based calculation (millimeters from G-line)
- 100% = perfect alignment (±0mm)
- Granular scoring down to 1mm precision

### 3. REST API Endpoints 🌐

- `GET /health` - Health check endpoint
- `POST /analyze-split` - Image analysis and scoring endpoint

### 4. Response Features 📊

- Precise percentage score (0-100)
- Distance from G-line in millimeters
- Confidence scores for detections
- Human-readable feedback
- Detailed debug information
- Comprehensive error messages

### 5. Image Processing 🖼️

- Supports JPEG and PNG formats
- Maximum file size: 10MB
- Handles various lighting conditions
- Works with different angles (optimal: straight-on)
- Quality validation
- Resolution requirements: minimum 200x200px

### 6. Error Handling 🛡️

- Comprehensive input validation
- Graceful error messages
- Detection failure handling
- File type/size validation
- Image quality checks

## Technical Stack

### Backend Framework
- **Flask 3.0.0** - Web framework
- **Flask-CORS 4.0.0** - Cross-origin resource sharing
- **Werkzeug 3.0.1** - WSGI utilities

### Computer Vision
- **OpenCV 4.8.1** - Image processing and analysis
- **NumPy 1.24.3** - Numerical computations
- **Pillow 10.1.0** - Image handling
- **SciPy 1.11.4** - Scientific computing (smoothing)

### Development & Testing
- **pytest 7.4.3** - Testing framework
- **requests 2.31.0** - HTTP client for testing

## Key Algorithms

### 1. Glass Detection Algorithm

```python
- Convert to grayscale
- Apply Canny edge detection
- Find contours
- Filter by aspect ratio (height > 1.5 × width)
- Select largest valid contour
- Extract bounding box
```

### 2. G-line Detection Algorithm

```python
- Focus on upper 40% of glass (logo region)
- Apply adaptive thresholding
- Use morphological operations with horizontal kernel
- Detect horizontal lines
- Score based on length and position
- Select most prominent line as G-line crossbar
```

### 3. Foam Boundary Detection Algorithm

```python
- Focus on central vertical strip of glass
- Apply Gaussian blur
- Calculate vertical gradients (Sobel)
- Find strongest horizontal edge in search region
- Identify as foam/liquid boundary
- Calculate confidence from gradient strength
```

### 4. Scoring Algorithm

```python
- Measure pixel distance between lines
- Calibrate to millimeters (glass height ~150mm)
- Calculate absolute distance
- Interpolate score from distance using scoring table
- Return precision score (0-100)
```

## API Response Example

```json
{
  "score": 98,
  "distance_from_g_line_mm": -2.0,
  "g_line_detected": true,
  "confidence": 0.92,
  "feedback": "Excellent pour! Foam line is 2.0mm below the G-line.",
  "debug_info": {
    "g_line_y_position": 245,
    "foam_line_y_position": 253,
    "pixel_distance": 8,
    "mm_per_pixel": 0.25,
    "glass_height_pixels": 600,
    "harp_confidence": 0.95,
    "foam_confidence": 0.89
  }
}
```

## Deployment Options

### Local Development
```bash
./start.sh
```

### Docker
```bash
docker-compose up -d
```

### Production (Gunicorn)
```bash
gunicorn -c gunicorn_config.py app:app
```

### Cloud Platforms Supported
- AWS Elastic Beanstalk
- Google Cloud Run
- Heroku
- DigitalOcean App Platform

## Testing

### Unit Tests
```bash
pytest test_api.py
```

### Manual Testing
```bash
python test_api.py path/to/image.jpg
```

### Example Usage
```bash
python example_usage.py
```

## Configuration

### Environment Variables
- `FLASK_ENV` - Environment (development/production)
- `SECRET_KEY` - Flask secret key
- `CORS_ORIGINS` - Allowed origins
- `LOG_LEVEL` - Logging level

### Configurable Parameters
- Maximum file size (default: 10MB)
- Allowed file extensions (JPEG, PNG)
- Scoring thresholds
- Detection sensitivity
- Glass calibration constants

## Future Enhancements

Potential additions:
- [ ] Machine learning model for improved logo detection
- [ ] Support for different glass types
- [ ] Historical scoring analytics
- [ ] User authentication
- [ ] Rate limiting
- [ ] Caching layer
- [ ] Image preprocessing optimization
- [ ] GPU acceleration for processing
- [ ] Batch processing endpoint
- [ ] WebSocket support for real-time analysis

## Performance Characteristics

- **Processing Time**: ~1-3 seconds per image (CPU)
- **Memory Usage**: ~200-500MB base + image processing
- **Concurrent Requests**: Supports multiple workers
- **Scalability**: Horizontally scalable with load balancer

## Security Features

- File type validation
- File size limits
- Input sanitization
- CORS configuration
- Error message sanitization
- No sensitive data storage

## Documentation

- **README.md** - Setup and quick start guide
- **API_REFERENCE.md** - Complete API documentation
- **DEPLOYMENT.md** - Deployment instructions
- **PROJECT_SUMMARY.md** - This comprehensive overview

## Quick Start

1. **Install dependencies:**
   ```bash
   cd api
   pip install -r requirements.txt
   ```

2. **Run the API:**
   ```bash
   python app.py
   ```

3. **Test it:**
   ```bash
   curl -X POST http://localhost:5000/analyze-split \
     -F "image=@guinness.jpg"
   ```

## Integration Example

```javascript
// Frontend integration
const formData = new FormData();
formData.append('image', imageFile);

const response = await fetch('http://localhost:5000/analyze-split', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(`Score: ${result.score}/100`);
```

## Success Criteria

✅ **Achieved:**
- Flask API with /analyze-split endpoint
- Computer vision-based G-line detection
- Foam boundary detection
- Precise distance measurement
- Accurate scoring algorithm (0-100%)
- Comprehensive error handling
- Full documentation
- Testing utilities
- Docker support
- Production deployment guides

## License

Part of the Guinness Split Judge application.

---

**Built with ❤️ for perfect Guinness pours 🍺**
