#!/usr/bin/env bash
# Exit on error
set -o errexit

# Print environment information (for debugging)
echo "Python version: $(python --version)"
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Install dependencies
pip install --upgrade pip
echo "Installing dependencies from requirements.txt..."
pip install -r requirements.txt

# Create necessary directories if they don't exist
mkdir -p static
mkdir -p templates

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --no-input --clear

# Check if templates directory exists
echo "Templates directory contents:"
ls -la templates/ || echo "No templates directory found"

# Check if static files were collected
echo "Static files collected:"
ls -la staticfiles/ || echo "No staticfiles directory found"

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

echo "Build completed successfully!"