# API Reference - Guinness Split the G API

Complete API documentation for the Guinness Split the G scoring system.

## Base URL

```
http://localhost:5000
```

In production, replace with your actual domain.

---

## Endpoints

### 1. Health Check

Check if the API is running and healthy.

**Endpoint:** `GET /health`

**Parameters:** None

**Response:**

```json
{
  "status": "healthy",
  "service": "guinness-split-scorer",
  "version": "1.0.0"
}
```

**Status Codes:**
- `200 OK` - Service is healthy

**Example:**

```bash
curl http://localhost:5000/health
```

---

### 2. Analyze Guinness Split

Upload a Guinness pint image and receive a score based on the Split the G technique.

**Endpoint:** `POST /analyze-split`

**Content-Type:** `multipart/form-data`

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| image | File | Yes | JPEG or PNG image file (max 10MB) |

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

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| score | integer | Score from 0-100 based on alignment accuracy |
| distance_from_g_line_mm | float | Distance in millimeters from the G-line crossbar<br>• Negative = foam below G-line<br>• Positive = foam above G-line<br>• 0 = perfect alignment |
| g_line_detected | boolean | Whether the G-line was successfully detected |
| confidence | float | Overall confidence of detection (0.0 to 1.0) |
| feedback | string | Human-readable feedback about the pour quality |
| debug_info | object | Detailed technical information |

**Debug Info Fields:**

| Field | Type | Description |
|-------|------|-------------|
| g_line_y_position | integer | Y-coordinate of G-line in image (pixels) |
| foam_line_y_position | integer | Y-coordinate of foam boundary in image (pixels) |
| pixel_distance | integer | Distance between lines in pixels |
| mm_per_pixel | float | Calibration ratio (millimeters per pixel) |
| glass_height_pixels | integer | Detected glass height in pixels |
| harp_confidence | float | Confidence of harp/G-line detection (0.0 to 1.0) |
| foam_confidence | float | Confidence of foam boundary detection (0.0 to 1.0) |

**Error Responses:**

#### 400 Bad Request - No Image Provided

```json
{
  "error": "No image file provided",
  "message": "Please upload an image file with key \"image\""
}
```

#### 400 Bad Request - Invalid File Type

```json
{
  "error": "Invalid file type",
  "message": "Allowed file types: png, jpg, jpeg"
}
```

#### 400 Bad Request - Glass Not Detected

```json
{
  "error": "Glass not detected",
  "message": "Could not detect a Guinness glass in the image. Ensure the glass is clearly visible."
}
```

#### 400 Bad Request - G-line Not Detected

```json
{
  "error": "G-line not detected",
  "message": "Could not detect the Guinness harp logo or G-line. Ensure the logo is visible and in focus."
}
```

#### 400 Bad Request - Foam Boundary Not Detected

```json
{
  "error": "Foam boundary not detected",
  "message": "Could not detect the foam/liquid boundary. Ensure there is clear contrast in the image."
}
```

#### 413 Payload Too Large

```json
{
  "error": "File too large",
  "message": "Maximum file size is 10MB"
}
```

#### 500 Internal Server Error

```json
{
  "error": "Processing error",
  "message": "Error message here",
  "details": "Stack trace (only in debug mode)"
}
```

**Examples:**

**cURL:**

```bash
curl -X POST http://localhost:5000/analyze-split \
  -F "image=@guinness_pint.jpg"
```

**Python (requests):**

```python
import requests

url = "http://localhost:5000/analyze-split"
files = {"image": open("guinness_pint.jpg", "rb")}
response = requests.post(url, files=files)

if response.status_code == 200:
    result = response.json()
    print(f"Score: {result['score']}/100")
    print(f"Distance: {result['distance_from_g_line_mm']}mm")
    print(f"Feedback: {result['feedback']}")
else:
    error = response.json()
    print(f"Error: {error['error']}")
    print(f"Message: {error['message']}")
```

**JavaScript (fetch):**

```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('http://localhost:5000/analyze-split', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.score !== undefined) {
    console.log(`Score: ${data.score}/100`);
    console.log(`Distance: ${data.distance_from_g_line_mm}mm`);
    console.log(`Feedback: ${data.feedback}`);
  } else {
    console.error(`Error: ${data.error}`);
  }
})
.catch(error => console.error('Request failed:', error));
```

**JavaScript (axios):**

```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

axios.post('http://localhost:5000/analyze-split', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
.then(response => {
  const data = response.data;
  console.log(`Score: ${data.score}/100`);
  console.log(`Distance: ${data.distance_from_g_line_mm}mm`);
  console.log(`Feedback: ${data.feedback}`);
})
.catch(error => {
  if (error.response) {
    console.error(`Error: ${error.response.data.error}`);
  } else {
    console.error('Request failed:', error.message);
  }
});
```

---

## Scoring System

The scoring algorithm uses precise distance-based calculation:

| Distance from G-line | Score |
|---------------------|-------|
| ±0mm | 100% |
| ±1mm | 99% |
| ±2mm | 98% |
| ±5mm | 95% |
| ±8mm | 90% |
| ±10mm | 85% |
| ±12mm | 80% |
| ±15mm | 70% |
| ±18mm | 60% |
| ±20mm | 50% |
| ±40mm+ | 0% |

Scores between these points are smoothly interpolated using linear interpolation.

### Scoring Formula

For a distance `d` between two points in the table `(d1, s1)` and `(d2, s2)`:

```
score = s1 + (s2 - s1) × (d - d1) / (d2 - d1)
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider implementing:

- **Per-IP rate limiting**: e.g., 100 requests per hour
- **Per-API-key rate limiting**: if authentication is added
- **Global rate limiting**: to protect server resources

Recommended tools: Flask-Limiter, nginx limit_req

---

## CORS Configuration

The API has CORS enabled for all origins (`*`) by default. For production:

1. Set the `CORS_ORIGINS` environment variable to your frontend domain
2. Update `app.py` to use the config value

Example:
```python
CORS(app, origins=os.environ.get('CORS_ORIGINS', '*').split(','))
```

---

## Error Handling

All errors follow this format:

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "details": "Additional details (optional, debug mode only)"
}
```

**Error Types:**

- `No image file provided` - Request missing image
- `Invalid file type` - File extension not allowed
- `Image too small` - Image resolution too low
- `Glass not detected` - Cannot identify glass in image
- `G-line not detected` - Cannot find harp logo or G-line
- `Foam boundary not detected` - Cannot detect foam/liquid boundary
- `Processing error` - General processing failure
- `File too large` - Uploaded file exceeds limit

---

## Best Practices

### For Best Results

1. **Image Quality:**
   - Minimum resolution: 640x480 pixels
   - Recommended: 1280x720 or higher
   - Clear, in-focus image
   - Good lighting

2. **Camera Angle:**
   - Straight-on view of the glass
   - Avoid extreme angles (top-down or from below)
   - Center the glass in frame

3. **Glass Visibility:**
   - Entire glass visible in frame
   - Harp logo clearly visible
   - Good contrast between foam and liquid

4. **File Format:**
   - Use JPEG for photos
   - Use PNG for high-quality captures
   - Avoid heavily compressed images

### Client-Side Validation

Before sending to API:

```javascript
function validateImage(file) {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' };
  }

  // Check file size (10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'File too large (max 10MB)' };
  }

  return { valid: true };
}
```

---

## Testing

### Test with cURL

```bash
# Health check
curl http://localhost:5000/health

# Analyze image
curl -X POST http://localhost:5000/analyze-split \
  -F "image=@test_image.jpg" \
  | jq '.'
```

### Test with Python Script

```bash
python test_api.py
```

Or with a specific image:

```bash
python test_api.py path/to/guinness.jpg
```

---

## Versioning

Current version: **1.0.0**

The API uses semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

Future versions may include:
- v1.1.0: Additional quality metrics
- v2.0.0: Breaking changes to response format

---

## Support

For issues or questions:

1. Check the main [README.md](README.md)
2. Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment issues
3. Run tests with `python test_api.py`
4. Enable debug mode for detailed error messages

---

**Happy scoring! 🍺**
