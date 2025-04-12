import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const List = ({ data, symbol }) => {
  const navigate = useNavigate();

  if (!data || data.length === 0) {
    return <div className="empty-state">No data available</div>;
  }

  const formatNumber = (num) => {
    return num ? parseFloat(num).toFixed(2) : 'N/A';
  };

  const formatVolume = (vol) => {
    return vol ? parseInt(vol).toLocaleString() : 'N/A';
  };

  const handleRowClick = (entry) => {
    // Extract just the date part (YYYY-MM-DD)
    const dateString = entry.date.slice(0, 10);
    navigate(`/detail/${symbol}/${dateString}`);
  };

  return (
    <div className="list-container">
      <table className="stock-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr 
              key={index} 
              onClick={() => handleRowClick(entry)}
              className="clickable-row"
            >
              <td>{entry.date?.slice(0, 10) || 'N/A'}</td>
              <td>{formatNumber(entry.open)}</td>
              <td>{formatNumber(entry.high)}</td>
              <td>{formatNumber(entry.low)}</td>
              <td>{formatNumber(entry.close)}</td>
              <td>{formatVolume(entry.volume)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;