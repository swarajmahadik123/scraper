#!/bin/bash

# Create a directory for Chrome and ChromeDriver
mkdir -p chrome-driver

# Download and install Google Chrome version 119 (precompiled version)
CHROME_VERSION="119.0.6045.105"
CHROME_URL="https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Linux_x64%2F${CHROME_VERSION}%2Fchrome-linux.zip?alt=media"
wget -O chrome-linux.zip $CHROME_URL
unzip chrome-linux.zip -d chrome-driver
export PATH=$PATH:$(pwd)/chrome-driver/chrome-linux

# Hardcoded ChromeDriver version and URL for version 119
CHROME_DRIVER_VERSION="119.0.6045.105"
CHROME_DRIVER_URL="https://storage.googleapis.com/chrome-for-testing-public/$CHROME_DRIVER_VERSION/linux64/chromedriver-linux64.zip"

echo "Installing ChromeDriver version: $CHROME_DRIVER_VERSION"

# Download and install ChromeDriver
wget -N $CHROME_DRIVER_URL
unzip chromedriver-linux64.zip -d chrome-driver
chmod +x chrome-driver/chromedriver-linux64/chromedriver
export PATH=$PATH:$(pwd)/chrome-driver/chromedriver-linux64

# Verify installations
echo "Google Chrome version: $(chrome --version)"
echo "ChromeDriver version: $(chromedriver --version)"

# Install Node.js dependencies (if applicable)
npm install
