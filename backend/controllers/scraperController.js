import SeleniumService from "../services/seleniumService.js";
import Trend from "../models/Trend.js";

const seleniumService = new SeleniumService();

export const scrapeTrends = async (req, res) => {
  try {
    console.log("Starting scraping process...");

    // Scrape trending topics
    const scrapedData = await seleniumService.scrapeTrendingTopics();

    console.log("Saving to database... (scraped data)", scrapedData);

    // Include the IP address from the request
    const ipAddress = req.ip || "Unknown"; // Fallback to "Unknown" if IP is not available

    // Map the trends array to the schema fields
    const trendData = {
      nameoftrend1: scrapedData.trends[0] || "N/A",
      nameoftrend2: scrapedData.trends[1] || "N/A",
      nameoftrend3: scrapedData.trends[2] || "N/A",
      nameoftrend4: scrapedData.trends[3] || "N/A",
      nameoftrend5: scrapedData.trends[4] || "N/A",
      timestamp: scrapedData.timestamp,
      ipAddress: ipAddress,
    };

    // Create a new Trend document
    const trend = new Trend(trendData);

    // Save the document to the database
    await trend.save();

    console.log("Data saved successfully");
    res.status(200).json({
      status: "success",
      data: trendData, // Return the data in the required format
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
