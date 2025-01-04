import React from "react";
import TrendingScraper from "./components/TrendingScraper";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      
      <>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <TrendingScraper />
        </div>
      </>
    </div>
  );
};

export default App;
