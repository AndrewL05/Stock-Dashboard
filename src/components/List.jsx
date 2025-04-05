import React from 'react';
import '../App.css';

const List = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="empty-state">No data available</div>;
  }

  const formatNumber = (num) => {
    return num ? parseFloat(num).toFixed(2) : 'N/A';
  };

  const formatVolume = (vol) => {
    return vol ? parseInt(vol).toLocaleString() : 'N/A';
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
            <tr key={index}>
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