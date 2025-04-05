import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockGraph = ({ data }) => {
  const labels = data.map(entry => entry.date.slice(0, 10)); // Use dates as labels
  const closingPrices = data.map(entry => parseFloat(entry.close));

  const chartData = {
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white', 
        },
      },
      title: {
        display: true,
        text: 'Stock Closing Prices Over Time',
        color: 'white', 
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Price ($)',
          color: 'white',
        },
        ticks: {
          color: 'white', 
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          color: 'white', 
        },
        ticks: {
          color: 'white', 
        },
      },
    },
    color: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? '#ffffff' : '#1a252f',
  };

  return <Line data={chartData} options={options} />;
};

export default StockGraph;