#!/bin/bash

# Download and install Google Chrome (precompiled version)
CHROME_VERSION="131.0.6778.204"
wget -N https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
mkdir -p chrome
dpkg -x google-chrome-stable_current_amd64.deb chrome
export PATH=$PATH:$(pwd)/chrome/opt/google/chrome

# Extract the major version of Chrome (e.g., 131 from 131.0.6778.204)
CHROME_MAJOR_VERSION=$(echo $CHROME_VERSION | cut -d '.' -f 1)

# Fetch the corresponding ChromeDriver version
CHROME_DRIVER_VERSION=$(curl -sS https://chromedriver.storage.googleapis.com/LATEST_RELEASE_$CHROME_MAJOR_VERSION)

# Check if CHROME_DRIVER_VERSION is set correctly
if [ -z "$CHROME_DRIVER_VERSION" ]; then
  echo "Failed to fetch ChromeDriver version. Exiting."
  exit 1
fi

echo "Installing ChromeDriver version: $CHROME_DRIVER_VERSION"

# Download and install ChromeDriver
wget -N https://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip
unzip chromedriver_linux64.zip
chmod +x chromedriver
mv -f chromedriver /usr/local/bin/chromedriver
rm chromedriver_linux64.zip

# Verify installations
echo "Google Chrome version: $(google-chrome --version)"
echo "ChromeDriver version: $(chromedriver --version)"

# Install Node.js dependencies (if applicable)
npm install
