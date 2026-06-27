import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { TbFileExport } from "react-icons/tb";
import './Header.css';
import logo from '../../assets/logo.jpg';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const getLinkClass = ({ isActive }) => 
    isActive ? "nav-link active" : "nav-link";

  const isAnalysisPage = location.pathname === '/results' || location.pathname === '/swot-detail';

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <img src={logo} alt="IdeaLab Logo" className="logo-img" />
          <span className="logo-text">IdeaLab</span>
        </div>

        <nav className="header-nav">
          {!isAnalysisPage ? (
            <>
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
            </>
          ) : (
            <>
              <NavLink to="/" className={getLinkClass} end>
                Dashboard
              </NavLink>
              <NavLink to="/analyze" className={getLinkClass}>
                New Analysis
              </NavLink>
              <span className="nav-link" style={{ cursor: 'pointer' }}>
                History
              </span>
            </>
          )}
        </nav>

        {!isAnalysisPage ? (
          <button className="header-btn">Get Started</button>
        ) : (
          <button className="header-btn-ghost" onClick={() => window.print()}>
            <TbFileExport size={18} style={{ marginBottom: '-2px' }} /> 
            Export PDF
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;