import React from 'react';
import './App.css';

const About = () => {
  return (
    <div className="about-container">
      <h2>About Stock Dashboard</h2>
      <p>
        This stock dashboard application provides real-time and historical data for stock prices
        using the Marketstack API. Users can search for different stocks by symbol, filter data
        by price range and date range, and view detailed information about each stock.
      </p>
      <h3>Features</h3>
      <ul>
        <li>Search stocks by symbol (e.g., AAPL, MSFT, GOOGL)</li>
        <li>View key metrics including average close, highest close, lowest close, and average volume</li>
        <li>Filter data by price range and date range</li>
        <li>Interactive charts showing price trends and volume data</li>
        <li>Detailed view of individual stock trading days</li>
      </ul>
      <h3>Data Source</h3>
      <p>
        All stock data is provided by the Marketstack API, which offers end-of-day and 
        intraday stock prices for global stock exchanges.
      </p>
    </div>
  );
};

export default About;