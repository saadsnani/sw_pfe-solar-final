#!/bin/bash

# 🚀 Quick Setup Script for Solar Dashboard
# Run this after cloning the repository

echo "================================"
echo "   Solar Dashboard Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "📥 Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Create data directory if it doesn't exist
echo "📁 Creating data directory..."
mkdir -p data
touch data/.gitkeep

# Create empty data files
echo "[]" > data/sensor-readings.json
echo "[]" > data/battery-temperature.json
echo "[]" > data/login-logs.json
echo "[]" > data/feedback.json

echo "✅ Data files created"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local file..."
    cat > .env.local << EOF
# Add your environment variables here
NEXT_PUBLIC_API_URL=http://localhost:3000

# Email service (optional)
# EMAILJS_SERVICE_ID=your_service_id
# EMAILJS_TEMPLATE_ID=your_template_id
# EMAILJS_PUBLIC_KEY=your_public_key
EOF
    echo "✅ .env.local created"
fi

echo ""
echo "================================"
echo "   ✨ Setup Complete! ✨"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Run: npm run dev"
echo "2. Open: http://localhost:3000"
echo "3. Upload code to ESP32/Arduino"
echo ""
echo "📖 Read DEPLOYMENT.md for full guide"
echo "🔧 Configure ESP32 WiFi credentials"
echo ""
