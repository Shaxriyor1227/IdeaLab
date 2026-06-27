import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/logo.jpg';

const Header = () => {
  const getLinkClass = ({ isActive }) => 
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <img src={logo} alt="IdeaLab Logo" className="logo-img" />
          <span className="logo-text">IdeaLab</span>
        </div>

        <nav className="header-nav">
          <NavLink to="/" className={getLinkClass} end>
            How it works
          </NavLink>
          <NavLink to="/features" className={getLinkClass}>
            Features
          </NavLink>
          <NavLink to="/analyze" className={getLinkClass}>
          Analyze
          </NavLink>
          <NavLink to="/results" className={getLinkClass}>
          Result
          </NavLink>
        </nav>

        <button className="header-btn">Get Started</button>
      </div>
    </header>
  );
};

export default Header;