import { useState, useEffect } from "react";
import Card from "./components/Card";
import List from "./components/List";
import NavBar from "./components/NavBar";
import PriceFilter from "./components/PriceFilter";
import DateRangeFilter from "./components/DateRangeFilter";
import StockGraph from "./components/StockGraph";
import VolumeChart from "./components/VolumeChart";

const App = () => {
  const [symbol, setSymbol] = useState("");
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [priceFilter, setPriceFilter] = useState({ minPrice: 0, maxPrice: Infinity });
  const [dateRange, setDateRange] = useState(10);
  const [visibleCharts, setVisibleCharts] = useState({
    priceHistory: true,
    volumeHistory: true
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = import.meta.env.VITE_MARKETSTACK_API_KEY;
        const response = await fetch(
          `https://api.marketstack.com/v1/eod?access_key=${apiKey}&symbols=${symbol}&limit=100`
        );
        
        if (!response.ok) {
          throw new Error(`Ticker symbol '${symbol}' not found!`);
        }
        
        const json = await response.json();
        
        if (!json.data || json.data.length === 0) {
          throw new Error("No data available for this symbol");
        }
        
        setStockData(json.data);
      } catch (error) {
        console.error("API Error:", error);
        setError(error.message);
        setStockData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  const getNumericValues = (data, key) => {
    return data
      .map(d => parseFloat(d[key]))
      .filter(val => !isNaN(val));
  };

  const closes = getNumericValues(stockData, 'close');
  const volumes = getNumericValues(stockData, 'volume');
  
  const filteredData = stockData
    .filter(entry => {
      const closePrice = parseFloat(entry.close);
      return closePrice >= priceFilter.minPrice && closePrice <= priceFilter.maxPrice;
    })
    .slice(0, dateRange) 
    .reverse();

  const avg = (arr) => {
    if (!arr.length) return 0;
    const sum = arr.reduce((a, b) => a + b, 0);
    return (sum / arr.length).toFixed(2);
  };

  const formatCurrency = (value) => {
    return isNaN(value) ? 'N/A' : `$${value}`;
  };

  const handlePriceFilterChange = (filter) => {
    setPriceFilter(filter);
  };

  const handleDateRangeChange = (days) => {
    setDateRange(days);
  };

  const toggleChartVisibility = (chartName) => {
    setVisibleCharts(prev => ({
      ...prev,
      [chartName]: !prev[chartName]
    }));
  };

  return (
    <div className="App">
      <div className="card-container">
        <Card title="Average Close" value={closes.length ? formatCurrency(avg(closes)) : 'N/A'} />
        <Card title="Highest Close" value={closes.length ? formatCurrency(Math.max(...closes)) : 'N/A'} />
        <Card title="Lowest Close" value={closes.length ? formatCurrency(Math.min(...closes)) : 'N/A'} />
        <Card title="Average Volume" value={volumes.length ? avg(volumes).toLocaleString() : 'N/A'} />
      </div>
      
      {loading && <div className="loading">Loading data...</div>}
      {error && <div className="error">{error}</div>}
      
      <div className="filters-container">
        <NavBar onSearch={setSymbol} />
        <PriceFilter onFilterChange={handlePriceFilterChange} />
        <DateRangeFilter onFilterChange={handleDateRangeChange} />
      </div>
      
      <div className="graph-container">
        <div className="chart-header">
          <h3>Price History</h3>
          <button 
            className="toggle-button"
            onClick={() => toggleChartVisibility('priceHistory')}
          >
            {visibleCharts.priceHistory ? 'Hide' : 'Show'}
          </button>
        </div>
        {visibleCharts.priceHistory && (
          <div className="chart-wrapper">
            <StockGraph data={filteredData} />
          </div>
        )}
      </div>
      
      <div className="graph-container">
        <div className="chart-header">
          <h3>Volume History</h3>
          <button 
            className="toggle-button"
            onClick={() => toggleChartVisibility('volumeHistory')}
          >
            {visibleCharts.volumeHistory ? 'Hide' : 'Show'}
          </button>
        </div>
        {visibleCharts.volumeHistory && (
          <div className="chart-wrapper">
            <VolumeChart data={filteredData} />
          </div>
        )}
      </div>
      
      <List data={filteredData} symbol={symbol} />
    </div>
  );
};

export default App;