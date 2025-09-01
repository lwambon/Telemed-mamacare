#!/usr/bin/env bash
# Exit on error
set -o errexit

# Print environment information
echo "Python version: $(python --version)"
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Upgrade pip and setuptools
pip install --upgrade pip setuptools wheel

# Try installing requirements with different approaches
echo "Installing dependencies from requirements.txt..."

# First try normal installation
if pip install -r requirements.txt; then
    echo "Requirements installed successfully"
else
    echo "Standard installation failed, trying with --no-cache-dir"
    pip install --no-cache-dir -r requirements.txt || {
        echo "Installation failed, trying individual packages"
        # If that fails, try installing packages one by one
        while read -r package; do
            if [ -n "$package" ]; then
                echo "Installing $package..."
                pip install --no-cache-dir "$package" || echo "Failed to install $package"
            fi
        done < requirements.txt
    }
fi

# Create necessary directories
mkdir -p static
mkdir -p templates

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --no-input --clear

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

echo "Build completed successfully!"