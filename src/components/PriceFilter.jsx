import { useState } from "react";

const PriceFilter = ({ onFilterChange }) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    if (min > max) {
      alert("Minimum price cannot be greater than maximum price");
      return;
    }
    onFilterChange({ minPrice: min, maxPrice: max });
  };

  return (
    <div className="price-filter">
      <form onSubmit={handleFilterSubmit} className="filter-form">
        <div className="form-group">
          <label htmlFor="minPrice">Min Close Price</label>
          <input
            id="minPrice"
            type="number"
            step="0.01"
            placeholder="e.g. 100"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="maxPrice">Max Close Price</label>
          <input
            id="maxPrice"
            type="number"
            step="0.01"
            placeholder="e.g. 200"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <button type="submit" className="filter-button">Apply Filter</button>
      </form>
    </div>
  );
};

export default PriceFilter;