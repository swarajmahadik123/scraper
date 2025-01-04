import React from "react";
import TrendingScraper from "./components/TrendingScraper";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Twitter Trending Topics Scraper
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <TrendingScraper />
        </div>
      </main>
    </div>
  );
};

export default App;
