# Guinness Split the G API 🍺

A Flask-based computer vision API that scores Guinness pints based on the "Split the G" technique. The perfect pour has the foam line sitting exactly on the horizontal crossbar of the "G" in the Guinness harp logo.

## 🎯 What It Does

This API analyzes photos of Guinness pints and scores them based on how accurately the foam/liquid boundary aligns with the G-line crossbar in the harp logo. It's the ONLY metric that matters for the perfect Guinness pour.

### Scoring System

- **100%**: Foam line exactly at G-line crossbar (±0mm)
- **99%**: ±1mm from G-line
- **98%**: ±2mm from G-line
- **95%**: ±5mm from G-line
- **90%**: ±8mm from G-line
- **85%**: ±10mm from G-line
- **80%**: ±12mm from G-line
- **70%**: ±15mm from G-line
- **60%**: ±18mm from G-line
- **50%**: ±20mm from G-line
- **0%**: ±40mm+ (completely off)

Scores are smoothly interpolated between these points for precision.

## 🚀 Quick Start

### Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Installation

1. **Navigate to the API directory:**

```bash
cd api
```

2. **Create a virtual environment:**

```bash
python -m venv venv
```

3. **Activate the virtual environment:**

- On macOS/Linux:
  ```bash
  source venv/bin/activate
  ```
- On Windows:
  ```bash
  venv\Scripts\activate
  ```

4. **Install dependencies:**

```bash
pip install -r requirements.txt
```

### Running the API

Start the Flask development server:

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## 📡 API Endpoints

### Health Check

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "service": "guinness-split-scorer",
  "version": "1.0.0"
}
```

### Analyze Guinness Split

**POST** `/analyze-split`

Upload a Guinness pint image and get a score based on the Split the G technique.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image` (file) - JPEG or PNG image

**Example using cURL:**
```bash
curl -X POST http://localhost:5000/analyze-split \
  -F "image=@guinness_pint.jpg"
```

**Example using Python:**
```python
import requests

url = "http://localhost:5000/analyze-split"
files = {"image": open("guinness_pint.jpg", "rb")}
response = requests.post(url, files=files)
print(response.json())
```

**Success Response (200 OK):**
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

**Error Response (400 Bad Request):**
```json
{
  "error": "G-line not detected",
  "message": "Could not detect the Guinness harp logo or G-line. Ensure the logo is visible and in focus."
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `score` | integer | Precision score from 0-100 based on alignment with G-line |
| `distance_from_g_line_mm` | float | Distance in millimeters (negative = below, positive = above) |
| `g_line_detected` | boolean | Whether the G-line was successfully detected |
| `confidence` | float | Overall confidence of the detection (0-1) |
| `feedback` | string | Human-readable feedback about the pour quality |
| `debug_info` | object | Detailed technical information about the detection |

## 🔬 How It Works

### Computer Vision Pipeline

1. **Glass Detection**
   - Identifies the Guinness glass using edge detection and contour analysis
   - Validates aspect ratio to ensure it's a pint glass

2. **G-Line Detection**
   - Focuses on the upper portion of the glass where the harp logo is located
   - Uses morphological operations to detect horizontal lines
   - Identifies the most prominent horizontal line as the G-line crossbar

3. **Foam Boundary Detection**
   - Analyzes the central vertical strip of the glass
   - Uses gradient detection to find the strongest horizontal edge
   - Identifies this as the foam/liquid boundary

4. **Distance Calculation**
   - Measures pixel distance between G-line and foam boundary
   - Calibrates to millimeters based on glass dimensions
   - Calculates precision score using smooth interpolation

5. **Confidence Scoring**
   - Evaluates detection quality for each component
   - Returns overall confidence score

## 📸 Best Practices for Photos

For optimal results, ensure your photos have:

- ✅ **Clear view of the harp logo** - The logo should be visible and in focus
- ✅ **Good lighting** - Avoid dark pub photos if possible
- ✅ **Straight-on angle** - Photo should be roughly perpendicular to the glass
- ✅ **Foam contrast** - Clear distinction between foam and dark liquid
- ✅ **High resolution** - At least 640x480 pixels, higher is better
- ❌ **Avoid blur** - Use a steady hand or surface
- ❌ **Avoid extreme angles** - Don't shoot from too far above or below

## 🛠️ Development

### Project Structure

```
api/
├── app.py                 # Main Flask application
├── vision_processor.py    # Computer vision module
├── requirements.txt       # Python dependencies
├── README.md             # This file
└── uploads/              # Temporary upload directory (created automatically)
```

### Running Tests

```bash
pytest test_api.py
```

### Debug Mode

The API runs in debug mode by default during development. To run in production mode:

```python
# In app.py, change:
app.run(host='0.0.0.0', port=5000, debug=False)
```

## 🔧 Configuration

### Environment Variables

You can configure the following environment variables:

- `FLASK_ENV` - Set to `production` for production deployment
- `MAX_CONTENT_LENGTH` - Maximum file upload size (default: 10MB)

### Tuning Detection

If you need to adjust the detection sensitivity, you can modify parameters in `vision_processor.py`:

- `GLASS_HEIGHT_MM` - Calibration constant for glass height
- `SCORING_TABLE` - Distance-to-score mapping
- ROI parameters for logo and foam detection

## 🐛 Troubleshooting

### Common Issues

**"Glass not detected"**
- Ensure the glass takes up a significant portion of the image
- Try a photo with better lighting and contrast

**"G-line not detected"**
- Make sure the harp logo is clearly visible
- Check that the logo is in focus
- Try better lighting

**"Foam boundary not detected"**
- Ensure there's clear contrast between foam and liquid
- Check that the foam head is visible
- Avoid photos with reflections obscuring the boundary

**Low confidence scores**
- Improve photo quality (resolution, focus, lighting)
- Take photo from a more direct angle
- Ensure the entire glass is in frame

## 📚 References

- [Split the G App - Roboflow Blog](https://blog.roboflow.com/split-the-g-app/#how-we-score-a-split)
- OpenCV Documentation: https://docs.opencv.org/
- Flask Documentation: https://flask.palletsprojects.com/

## 📄 License

This project is part of the Guinness Split Judge application.

## 🤝 Contributing

To improve the detection algorithm:

1. Collect diverse training images
2. Tune detection parameters in `vision_processor.py`
3. Test with various lighting conditions and angles
4. Submit improvements via pull request

---

**Enjoy your perfectly poured Guinness! 🍺**
