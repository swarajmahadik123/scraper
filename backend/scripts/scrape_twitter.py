from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
import time
import uuid
from pymongo import MongoClient
import requests

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['twitterTrends']
collection = db['trends']

def get_free_proxy():
    url = 'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all'
    response = requests.get(url)
    proxies = response.text.split('\r\n')
    return proxies[0]  # Return the first proxy

def get_trends():
    # Fetch a free proxy
    proxy = get_free_proxy()
    print(f'Using proxy: {proxy}')

    # Set up Selenium with proxy
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument(f'--proxy-server=http://{proxy}')
    service = Service('/path/to/chromedriver')  # Update with your ChromeDriver path
    driver = webdriver.Chrome(service=service, options=chrome_options)

    # Log in to Twitter (replace with your credentials)
    driver.get('https://twitter.com/login')
    time.sleep(5)
    driver.find_element(By.NAME, 'username').send_keys('your_username')
    driver.find_element(By.NAME, 'password').send_keys('your_password')
    driver.find_element(By.XPATH, '//div[@role="button"]').click()
    time.sleep(5)

    # Fetch trending topics
    driver.get('https://twitter.com')
    time.sleep(5)
    trends = driver.find_elements(By.XPATH, '//div[@aria-label="Timeline: Trending now"]//span')
    top_trends = [trend.text for trend in trends[:5]]

    # Close the browser
    driver.quit()

    # Get IP address
    ip_response = requests.get('https://api.ipify.org?format=json')
    ip_address = ip_response.json()['ip']

    # Save to MongoDB
    unique_id = str(uuid.uuid4())
    record = {
        'uniqueId': unique_id,
        'trend1': top_trends[0],
        'trend2': top_trends[1],
        'trend3': top_trends[2],
        'trend4': top_trends[3],
        'trend5': top_trends[4],
        'dateTime': time.strftime('%Y-%m-%d %H:%M:%S'),
        'ipAddress': ip_address,
    }
    collection.insert_one(record)

    return record

if __name__ == '__main__':
    print(get_trends())