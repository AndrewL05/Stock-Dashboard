import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Detail = () => {
  const { symbol, date } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
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
          `https://api.marketstack.com/v1/eod?access_key=${apiKey}&symbols=${symbol}&limit=10`
        );
        
        if (!response.ok) {
          throw new Error(`Ticker symbol '${symbol}' not found!`);
        }
        
        const json = await response.json();
        
        if (!json.data || json.data.length === 0) {
          throw new Error("No data available for this symbol");
        }
        
        setHistoricalData(json.data);
        
        const dayData = json.data.find(item => item.date.includes(date));
        if (dayData) {
          setStockData(dayData);
        } else {
          throw new Error(`No data found for ${symbol} on ${date}`);
        }
      } catch (error) {
        console.error("API Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (symbol && date) {
      fetchData();
    }
  }, [symbol, date]);
  
  const toggleChartVisibility = (chartName) => {
    setVisibleCharts(prev => ({
      ...prev,
      [chartName]: !prev[chartName]
    }));
  };
  
  if (loading) return <div className="loading">Loading data...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stockData) return <div className="error">Stock data not found</div>;

  const labels = historicalData
    .slice(0, 30)
    .reverse()
    .map(entry => entry.date.slice(0, 10));
    
  const closingPrices = historicalData
    .slice(0, 30)
    .reverse()
    .map(entry => parseFloat(entry.close));
    
  const volumes = historicalData
    .slice(0, 30)
    .reverse()
    .map(entry => parseInt(entry.volume));

  const priceChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Closing Price',
        data: closingPrices,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const volumeChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Trading Volume',
        data: volumes,
        backgroundColor: 'rgba(46, 204, 113, 0.6)',
        borderColor: 'rgba(46, 204, 113, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
        text: `${symbol} Historical Data`,
        color: 'white',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: { color: 'white' },
      },
      x: {
        ticks: { color: 'white' },
      },
    },
  };

  const calculatePercentChange = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const previousClose = historicalData[1] ? parseFloat(historicalData[1].close) : null;
  const currentClose = parseFloat(stockData.close);
  const percentChange = previousClose ? calculatePercentChange(currentClose, previousClose).toFixed(2) : 'N/A';
  const isPositive = percentChange > 0;

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h2>{symbol} - {date}</h2>
        <Link to="/" className="back-link">← Back to Dashboard</Link>
      </div>
      
      <div className="detail-card-container">
        <div className="detail-card">
          <h3>Open</h3>
          <p>${parseFloat(stockData.open).toFixed(2)}</p>
        </div>
        <div className="detail-card">
          <h3>High</h3>
          <p>${parseFloat(stockData.high).toFixed(2)}</p>
        </div>
        <div className="detail-card">
          <h3>Low</h3>
          <p>${parseFloat(stockData.low).toFixed(2)}</p>
        </div>
        <div className="detail-card">
          <h3>Close</h3>
          <p>${parseFloat(stockData.close).toFixed(2)}</p>
        </div>
        <div className="detail-card">
          <h3>Volume</h3>
          <p>{parseInt(stockData.volume).toLocaleString()}</p>
        </div>
        <div className="detail-card">
          <h3>Change</h3>
          <p className={isPositive ? "positive-change" : "negative-change"}>
            {isPositive ? '+' : ''}{percentChange}%
          </p>
        </div>
      </div>
      
      <div className="detail-chart-container">
        <div className="chart-box">
          <div className="chart-header">
            <h3>Price History (Last 30 Days)</h3>
            <button 
              className="toggle-button"
              onClick={() => toggleChartVisibility('priceHistory')}
            >
              {visibleCharts.priceHistory ? 'Hide' : 'Show'}
            </button>
          </div>
          {visibleCharts.priceHistory && (
            <div className="chart-wrapper">
              <Line data={priceChartData} options={chartOptions} />
            </div>
          )}
        </div>
        
        <div className="chart-box">
          <div className="chart-header">
            <h3>Volume History (Last 30 Days)</h3>
            <button 
              className="toggle-button"
              onClick={() => toggleChartVisibility('volumeHistory')}
            >
              {visibleCharts.volumeHistory ? 'Hide' : 'Show'}
            </button>
          </div>
          {visibleCharts.volumeHistory && (
            <div className="chart-wrapper">
              <Bar 
                data={volumeChartData} 
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      ...chartOptions.plugins.title,
                      text: 'Trading Volume History'
                    }
                  }
                }} 
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="additional-info">
        <h3>Additional Information</h3>
        <table className="detail-table">
          <tbody>
            <tr>
              <td>Symbol</td>
              <td>{stockData.symbol}</td>
            </tr>
            <tr>
              <td>Exchange</td>
              <td>{stockData.exchange}</td>
            </tr>
            <tr>
              <td>Date</td>
              <td>{stockData.date.slice(0, 10)}</td>
            </tr>
            <tr>
              <td>Adjusted Close</td>
              <td>${parseFloat(stockData.adj_close || stockData.close).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Split Factor</td>
              <td>{stockData.split_factor || 'N/A'}</td>
            </tr>
            <tr>
              <td>Dividend</td>
              <td>{stockData.dividend ? `$${parseFloat(stockData.dividend).toFixed(4)}` : 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Detail;