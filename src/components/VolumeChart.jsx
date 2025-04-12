import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VolumeChart = ({ data }) => {
  const labels = data.map(entry => entry.date.slice(0, 10));
  const volumes = data.map(entry => parseInt(entry.volume));

  const chartData = {
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

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          boxWidth: 10, 
          padding: 5, 
        },
      },
      title: {
        display: true,
        text: 'Trading Volume Over Time',
        color: 'white',
        font: {
          size: 14 
        },
        padding: {
          top: 5,
          bottom: 5
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Volume',
          color: 'white',
          font: {
            size: 12 
          }
        },
        ticks: {
          color: 'white',
          font: {
            size: 10 
          },
          callback: function(value) {
            if(value >= 1000000) {
              return (value/1000000).toFixed(1) + 'M';
            } else if(value >= 1000) {
              return (value/1000).toFixed(0) + 'K';
            }
            return value;
          }
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          color: 'white',
          font: {
            size: 12 
          }
        },
        ticks: {
          color: 'white',
          font: {
            size: 10 
          },
          maxRotation: 45, 
          minRotation: 45
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default VolumeChart;