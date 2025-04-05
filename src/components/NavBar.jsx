import { useState } from "react";
import '../App.css';

const NavBar = ({ onSearch }) => {
  const [symbol, setSymbol] = useState("AAPL");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!symbol.trim()) {
      alert("Please enter a stock symbol");
      return;
    }
    onSearch(symbol.trim().toUpperCase());
  };

  return (
    <nav className="navbar">
      <form onSubmit={handleSubmit} className="filter-form">
        <div className="form-group">
          <label htmlFor="symbol">Stock Symbol</label>
          <input 
            id="symbol"
            placeholder="e.g. AAPL, MSFT, GOOGL" 
            value={symbol}
            onChange={e => setSymbol(e.target.value)}
          />
        </div>
        <button type="submit" className="search-button">Search</button>
      </form>
    </nav>
  );
};

export default NavBar;