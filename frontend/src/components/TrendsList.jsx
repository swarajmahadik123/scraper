import React from "react";

const TrendsList = ({ trends }) => (
  <div>
    <h2>These are the most happening topics as on {trends.dateTime}</h2>
    <ul>
      <li>{trends.trend1}</li>
      <li>{trends.trend2}</li>
      <li>{trends.trend3}</li>
      <li>{trends.trend4}</li>
      <li>{trends.trend5}</li>
    </ul>
    <p>The IP address used for this query was {trends.ipAddress}.</p>
    <pre>{JSON.stringify(trends, null, 2)}</pre>
  </div>
);

export default TrendsList;
