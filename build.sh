#!/usr/bin/env bash
# Exit on error
set -o errexit

# Print current directory and list files (for debugging)
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Verify installation of required packages
echo "Installed packages:"
pip freeze

# Collect static files
python manage.py collectstatic --no-input

# Apply database migrations
python manage.py migrate