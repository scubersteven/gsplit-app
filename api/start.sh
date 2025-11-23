#!/bin/bash

# Guinness Split the G API - Startup Script
echo "======================================"
echo "Guinness Split the G API"
echo "======================================"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
    echo ""
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
if [ ! -f "venv/lib/python*/site-packages/flask/__init__.py" ]; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
    echo "✅ Dependencies installed"
    echo ""
fi

# Create uploads directory if it doesn't exist
mkdir -p uploads

# Start the Flask app
echo "🚀 Starting Flask API..."
echo "API will be available at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "======================================"
echo ""

python app.py
