#!/bin/bash

# Download and install Google Chrome (precompiled version)
CHROME_URL="https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb"
wget -N $CHROME_URL
mkdir -p chrome
dpkg -x google-chrome-stable_current_amd64.deb chrome
export PATH=$PATH:$(pwd)/chrome/opt/google/chrome

# Hardcoded ChromeDriver version and URL
CHROME_DRIVER_VERSION="131.0.6778.204"
CHROME_DRIVER_URL="https://storage.googleapis.com/chrome-for-testing-public/$CHROME_DRIVER_VERSION/linux64/chromedriver-linux64.zip"

echo "Installing ChromeDriver version: $CHROME_DRIVER_VERSION"

# Download and install ChromeDriver
wget -N $CHROME_DRIVER_URL
unzip chromedriver-linux64.zip
chmod +x chromedriver-linux64/chromedriver
mv -f chromedriver-linux64/chromedriver /usr/local/bin/chromedriver
rm -rf chromedriver-linux64 chromedriver-linux64.zip

# Verify installations
echo "Google Chrome version: $(google-chrome --version)"
echo "ChromeDriver version: $(chromedriver --version)"

# Install Node.js dependencies (if applicable)
npm install
