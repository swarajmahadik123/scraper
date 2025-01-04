import React, { useState } from "react";
import axios from "axios";

const TrendingScraper = () => {
  const [scrapedData, setScrapedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to format the trend string
  const formatTrend = (trend) => {
    if (!trend) return "N/A"; // Handle missing trends

    // Split the trend string by newlines and filter out empty strings
    const parts = trend.split("\n").filter((part) => part.trim() !== "");

    // Join the parts with spaces
    return parts.join(" ");
  };

  const runScraper = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("http://localhost:5000/api/scrape");
      console.log("Backend response:", response.data); // Debugging

      // Format the trends to remove newlines and join parts with spaces
      const formattedData = {
        ...response.data.data,
        nameoftrend1: formatTrend(response.data.data.nameoftrend1),
        nameoftrend2: formatTrend(response.data.data.nameoftrend2),
        nameoftrend3: formatTrend(response.data.data.nameoftrend3),
        nameoftrend4: formatTrend(response.data.data.nameoftrend4),
        nameoftrend5: formatTrend(response.data.data.nameoftrend5),
      };

      setScrapedData(formattedData);
    } catch (error) {
      console.error("Error running scraper:", error);
      setError("Error running scraper. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={runScraper}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? "Running..." : "Click here to run the script"}
      </button>

      {loading && (
        <div className="mt-4 text-gray-600">
          Please wait, it takes some time...
        </div>
      )}

      {error && <div className="mt-4 text-red-500">{error}</div>}

      {scrapedData && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">
            These are the most happening topics as on{" "}
            {new Date(scrapedData.timestamp).toLocaleString()}
          </h2>
          <ul className="list-disc ml-6 mt-2">
            <li className="my-1">{scrapedData.nameoftrend1}</li>
            <li className="my-1">{scrapedData.nameoftrend2}</li>
            <li className="my-1">{scrapedData.nameoftrend3}</li>
            <li className="my-1">{scrapedData.nameoftrend4}</li>
            <li className="my-1">{scrapedData.nameoftrend5}</li>
          </ul>
          <p className="mt-4">
            The IP address used for this query was {scrapedData.ipAddress}
          </p>
          <pre className="mt-4 bg-gray-100 p-4 rounded">
            {JSON.stringify(scrapedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TrendingScraper;
