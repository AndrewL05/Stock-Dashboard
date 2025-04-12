import { Outlet, NavLink } from 'react-router-dom';
import '../App.css';

const Sidebar = () => {
  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="logo">📊 StockApp</div>
        <nav className="sidebar-nav">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            Dashboard
          </NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            About
          </NavLink>
        </nav>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;