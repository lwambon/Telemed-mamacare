#!/usr/bin/env bash
# Exit on error
set -o errexit

# Print environment information
echo "Python version: $(python --version)"
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create static directory if it doesn't exist
mkdir -p static

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --no-input --clear

# Check if static files were collected
echo "Static files collected:"
ls -la staticfiles/ || echo "No staticfiles directory found"

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

echo "Build completed successfully!"