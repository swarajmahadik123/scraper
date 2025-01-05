#!/bin/bash

# Install Google Chrome
curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
apt-get -y update
apt-get -y install google-chrome-stable

# Get the installed Chrome version
CHROME_VERSION=$(google-chrome --version | awk '{print $3}' | cut -d '.' -f 1)

# Check if CHROME_VERSION is set correctly
if [ -z "$CHROME_VERSION" ]; then
  echo "Failed to fetch Chrome version. Exiting."
  exit 1
fi

# Download the corresponding ChromeDriver version
CHROME_DRIVER_VERSION=$(curl -sS https://chromedriver.storage.googleapis.com/LATEST_RELEASE_$CHROME_VERSION)

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

# Install Node.js dependencies (if applicable)
npm install
