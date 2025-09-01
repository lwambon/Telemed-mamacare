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

# Verify installation of key packages
echo "Checking installed packages:"
pip list | grep -E "(Django|gunicorn|requests|mysqlclient)"

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --no-input

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

echo "Build completed successfully!"