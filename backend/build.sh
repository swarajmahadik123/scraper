#!/bin/bash

# Create a directory for Chrome and ChromeDriver
mkdir -p chrome-driver

# Download and install Google Chrome version 114.0.5735.90
CHROME_VERSION="114.0.5735.90"
CHROME_URL="https://storage.googleapis.com/chrome-for-testing-public/${CHROME_VERSION}/chrome-linux64.zip"

echo "Downloading Chrome version: $CHROME_VERSION"
wget -O chrome-linux.zip $CHROME_URL
unzip chrome-linux.zip -d chrome-driver
chmod +x chrome-driver/chrome-linux64/chrome

# Add Chrome to PATH
export PATH=$PATH:$(pwd)/chrome-driver/chrome-linux64

# Download and install ChromeDriver
CHROME_DRIVER_VERSION="114.0.5735.90"
CHROME_DRIVER_URL="https://storage.googleapis.com/chrome-for-testing-public/${CHROME_DRIVER_VERSION}/chromedriver-linux64.zip"

echo "Installing ChromeDriver version: $CHROME_DRIVER_VERSION"
wget -O chromedriver-linux64.zip $CHROME_DRIVER_URL

# Check if download was successful
if [ $? -eq 0 ]; then
    unzip chromedriver-linux64.zip -d chrome-driver
    chmod +x chrome-driver/chromedriver-linux64/chromedriver
    
    # Add ChromeDriver to PATH
    export PATH=$PATH:$(pwd)/chrome-driver/chromedriver-linux64
    
    # Clean up zip files
    rm chrome-linux.zip chromedriver-linux64.zip
    
    # Verify installations
    echo "Updated PATH: $PATH"
    echo "Google Chrome version: $(chrome --version)"
    echo "ChromeDriver version: $(chromedriver --version)"
else
    echo "Failed to download ChromeDriver. Please check the version number and URL."
    exit 1
fi

# Install Node.js dependencies (if applicable)
if [ -f "package.json" ]; then
    npm install
fi
