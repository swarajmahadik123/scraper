import { Builder, By, until } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome.js";
import { ServiceBuilder } from "selenium-webdriver/chrome.js";
import { v4 as uuidv4 } from "uuid";
// Uncomment the following line if using ProxyMesh
// import ProxyChain from "proxy-chain";

export default class SeleniumService {
  constructor() {
    this.chromedriverPath = "C:\\chromedriver-win32\\chromedriver.exe";
  }

  async waitForElement(driver, selector, timeout = 10000) {
    try {
      return await driver.wait(until.elementLocated(selector), timeout);
    } catch (error) {
      console.error(`Failed to find element: ${selector}`);
      throw error;
    }
  }

  async scrapeTrendingTopics() {
    let driver;
    try {
      const options = new Options();
      options.addArguments(
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--window-size=1920,1080",
        "--disable-gpu",
        "--headless=new",
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      );

      let ipAddress = "Unknown"; // Default IP address if ProxyMesh is not used

      // Uncomment the following block to enable ProxyMesh
      /*
      const proxyUrl = "http://username:password@proxy.proxymesh.com:31280"; // Replace with your ProxyMesh credentials
      const newProxyUrl = await ProxyChain.anonymizeProxy(proxyUrl); // Anonymize the proxy URL
      options.addArguments(`--proxy-server=${newProxyUrl}`); // Set the proxy server

      // Extract the IP address from the proxy URL
      ipAddress = newProxyUrl.split("@")[1].split(":")[0];
      console.log("ProxyMesh IP Address:", ipAddress);
      */

      const service = new ServiceBuilder(this.chromedriverPath);
      driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .setChromeService(service)
        .build();

      console.log("Starting login process...");
      await driver.get("https://twitter.com/i/flow/login");
      await driver.sleep(10000); // Wait for the page to load

      // Try multiple selectors for username input
      const usernameSelectors = [
        By.css('input[autocomplete="username"]'),
        By.css('input[name="text"]'),
        By.css('input[autocomplete="email"]'),
        By.xpath('//input[@type="text"]'),
      ];

      let usernameInput = null;
      for (const selector of usernameSelectors) {
        try {
          console.log(`Trying username selector: ${selector}`);
          usernameInput = await driver.wait(
            until.elementLocated(selector),
            10000
          );
          if (usernameInput) {
            console.log(`Found username input with selector: ${selector}`);
            break;
          }
        } catch (e) {
          console.log(`Selector failed: ${selector}`);
        }
      }

      if (!usernameInput) {
        throw new Error(
          "Could not find username input with any known selector"
        );
      }

      await usernameInput.sendKeys(`${process.env.TWITTER_USERNAME}`); // Replace with your Twitter username
      await driver.sleep(1000);

      // Find and click next button
      console.log("Looking for next button...");
      const nextButtonSelector = By.xpath('//button//span[text()="Next"]');
      const nextButton = await driver.wait(
        until.elementLocated(nextButtonSelector),
        30000
      );
      await driver.wait(until.elementIsVisible(nextButton), 30000);
      await nextButton.click();
      await driver.sleep(2000);

      // Handle password input
      console.log("Looking for password input...");
      const passwordInput = await driver.wait(
        until.elementLocated(By.css('input[type="password"]')),
        30000
      );
      await driver.wait(until.elementIsVisible(passwordInput), 30000);
      await passwordInput.sendKeys(`${process.env.TWITTER_PASSWORD}`); // Twitter password
      await driver.sleep(1000);

      // Click login button
      console.log("Looking for login button...");
      const loginButtonSelector = By.css(
        'button[data-testid="LoginForm_Login_Button"]'
      );
      const loginButton = await driver.wait(
        until.elementLocated(loginButtonSelector),
        30000
      );
      await driver.wait(until.elementIsVisible(loginButton), 30000);
      await loginButton.click();
      await driver.sleep(5000);

      // Navigate to home page
      console.log("Navigating to home page...");
      await driver.get("https://twitter.com/home");
      await driver.sleep(5000); // Wait for the page to load

      // Check for "Show more" button and click it
      console.log("Looking for 'Show more' button...");
      try {
        const showMoreButton = await driver.wait(
          until.elementLocated(
            By.xpath('//span[contains(text(), "Show more")]')
          ),
          30000
        );
        await driver.wait(until.elementIsVisible(showMoreButton), 30000);
        await showMoreButton.click();
        await driver.sleep(2000); // Wait for the trending topics to load
      } catch (error) {
        console.log(
          "'Show more' button not found. Proceeding without clicking."
        );
      }

      // Get trending topics
      console.log("Looking for trending topics...");
      const trendElements = await driver.wait(
        until.elementsLocated(By.css('[data-testid="trend"]')),
        30000
      );

      // Fetch up to 10 trending topics
      const trends = [];
      console.log("Extracting trends...");
      for (let i = 0; i < trendElements.length && trends.length < 10; i++) {
        try {
          const trendText = await trendElements[i].getText();
          trends.push(trendText);
          console.log(`Trend ${i + 1}: ${trendText}`);
        } catch (error) {
          console.error(`Failed to extract trend ${i + 1}:`, error);
        }
      }

      if (trends.length < 10) {
        console.warn(`Only ${trends.length} trends were found. Expected 10.`);
      }

      if (trends.length === 0) {
        throw new Error("No trends were found");
      }

      // Select top 5 trends
      const top5Trends = trends.slice(0, 5);

      return {
        runId: uuidv4(),
        trends: top5Trends, // Return only the top 5 trends
        allTrends: trends, // Optional: Return all fetched trends for debugging
        timestamp: new Date(),
        ipAddress: ipAddress, // Include the IP address in the response
      };
    } catch (error) {
      console.error("Selenium Error:", error);
      throw error;
    } finally {
      if (driver) {
        await driver.quit();
      }
    }
  }
}
