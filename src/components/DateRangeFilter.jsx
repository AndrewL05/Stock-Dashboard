import { useState } from "react";

const DateRangeFilter = ({ onFilterChange }) => {
  const [selectedRange, setSelectedRange] = useState("10"); 

  const handleFilterChange = (e) => {
    setSelectedRange(e.target.value);
    onFilterChange(parseInt(e.target.value, 10)); 
  };

  return (
    <div className="date-filter">
      <form className="filter-form">
        <div className="form-group">
          <label htmlFor="dateRange">Date Range</label>
          <select
            id="dateRange"
            value={selectedRange}
            onChange={handleFilterChange}>
            <option value="10">Last 10 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="60">Last 60 Days</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default DateRangeFilter;