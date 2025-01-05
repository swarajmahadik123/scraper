#!/bin/bash

# Create a directory for Chrome and ChromeDriver
mkdir -p chrome-driver

# Using the latest Chrome version
CHROME_VERSION="131.0.6778.204"
CHROME_URL="https://storage.googleapis.com/chrome-for-testing-public/${CHROME_VERSION}/linux64/chrome-linux64.zip"

echo "Downloading Chrome version: $CHROME_VERSION"
wget -O chrome-linux.zip "$CHROME_URL"

# Check if Chrome download was successful
if [ $? -eq 0 ]; then
    unzip chrome-linux.zip -d chrome-driver
    chmod +x chrome-driver/chrome-linux64/chrome
    
    # Add Chrome to PATH
    export PATH=$PATH:$(pwd)/chrome-driver/chrome-linux64
    
    # Download and install ChromeDriver
    CHROME_DRIVER_URL="https://storage.googleapis.com/chrome-for-testing-public/${CHROME_VERSION}/linux64/chromedriver-linux64.zip"
    
    echo "Installing ChromeDriver version: $CHROME_VERSION"
    wget -O chromedriver-linux64.zip "$CHROME_DRIVER_URL"
    
    # Check if ChromeDriver download was successful
    if [ $? -eq 0 ]; then
        unzip chromedriver-linux64.zip -d chrome-driver
        chmod +x chrome-driver/chromedriver-linux64/chromedriver
        
        # Add ChromeDriver to PATH
        export PATH=$PATH:$(pwd)/chrome-driver/chromedriver-linux64
        
        # Clean up zip files
        rm chrome-linux.zip chromedriver-linux64.zip
        
        # Verify installations
        echo "Updated PATH: $PATH"
        
        # Get Chrome and ChromeDriver versions
        CHROME_VERSION_ACTUAL=$(chrome-driver/chrome-linux64/chrome --version | grep -oP '\d+\.\d+\.\d+\.\d+')
        CHROME_DRIVER_VERSION_ACTUAL=$(chrome-driver/chromedriver-linux64/chromedriver --version | grep -oP '\d+\.\d+\.\d+\.\d+')
        
        echo "Google Chrome version: $CHROME_VERSION_ACTUAL"
        echo "ChromeDriver version: $CHROME_DRIVER_VERSION_ACTUAL"
        
        # Cross-check versions
        if [ "$CHROME_VERSION_ACTUAL" != "$CHROME_DRIVER_VERSION_ACTUAL" ]; then
            echo "Version mismatch: Chrome ($CHROME_VERSION_ACTUAL) and ChromeDriver ($CHROME_DRIVER_VERSION_ACTUAL) versions do not match."
            exit 1
        else
            echo "Chrome and ChromeDriver versions match: $CHROME_VERSION_ACTUAL"
        fi
        
        # Output ChromeDriver path for environment variable
        CHROME_DRIVER_PATH="$(pwd)/chrome-driver/chromedriver-linux64/chromedriver"
        echo "ChromeDriver path: $CHROME_DRIVER_PATH"
        echo "Add the following to your environment variables:"
        echo "export CHROMEDRIVER_PATH=$CHROME_DRIVER_PATH"
    else
        echo "Failed to download ChromeDriver. Please check the version number and URL."
        exit 1
    fi
else
    echo "Failed to download Chrome. Please check the version number and URL."
    exit 1
fi

# Install Node.js dependencies (if applicable)
if [ -f "package.json" ]; then
    npm install
fi
