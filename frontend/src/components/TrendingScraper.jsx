"use client";

import React, { useState } from "react";
import axios from "axios";

const TrendingScraper = () => {
  const [scrapedData, setScrapedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatTrend = (trend) => {
    if (!trend) return "N/A";
    const parts = trend.split("\n").filter((part) => part.trim() !== "");
    return parts.join(" ");
  };

  const runScraper = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("http://localhost:5000/api/scrape");
      console.log("Backend response:", response.data);

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
    <div className="container mx-auto p-4 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full max-w-3xl mx-auto mt-10 bg-white/30 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
          <h1 className="text-2xl font-light">Trending Topics Scraper</h1>
        </div>
        <div className="p-6">
          <button
            onClick={runScraper}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {loading ? (
              <>
                <span className="animate-spin">🌀</span> Running...
              </>
            ) : (
              "Click here to run the script"
            )}
          </button>

          {loading && (
            <div className="mt-4 text-gray-600 text-center animate-pulse">
              Please wait, it takes some time...
            </div>
          )}

          {error && (
            <div className="mt-4 text-red-500 text-center">{error}</div>
          )}

          {scrapedData && (
            <div className="mt-6 space-y-4">
              <h2 className="text-xl font-light text-gray-800">
                Most happening topics as of{" "}
                <span className="font-semibold">
                  {new Date(scrapedData.timestamp).toLocaleString()}
                </span>
              </h2>
              <ul className="space-y-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <li
                    key={num}
                    className="bg-white/50 backdrop-blur-sm rounded-lg p-3 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md hover:scale-102"
                  >
                    {scrapedData[`nameoftrend${num}`]}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                IP address used:{" "}
                <span className="font-mono">{scrapedData.ipAddress}</span>
              </p>
              <details className="mt-6">
                <summary className="cursor-pointer text-blue-500 hover:text-blue-600">
                  View Raw Data
                </summary>
                <pre className="mt-2 bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                  {JSON.stringify(scrapedData, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingScraper;
