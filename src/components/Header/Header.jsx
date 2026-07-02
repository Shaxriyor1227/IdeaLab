import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { TbFileExport } from "react-icons/tb";
import { useAuth } from '../context/Authontext';
import './Header.css';
import logo from '../../assets/logo.jpg';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuth, logout, user } = useAuth();

  const getLinkClass = ({ isActive }) => 
    isActive ? "nav-link active" : "nav-link";

  const isAnalysisPage = location.pathname === '/results' || location.pathname === '/swot-detail' || location.pathname === '/history';

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
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
              <NavLink to="/history" className={getLinkClass}>
                History
              </NavLink>
            </>
          )}
        </nav>

        {isAnalysisPage ? (
          <button className="header-btn-ghost" onClick={() => window.print()}>
            <TbFileExport size={18} style={{ marginBottom: '-2px' }} />
            Export PDF
          </button>
        ) : (
          <div className="header-actions">
            {isAuth ? (
              <div className="user-profile-menu">
                <span className="user-name">{user?.name || 'User'}</span>
                <button className="header-btn logout-btn" onClick={logout}>Logout</button>
              </div>
            ) : (
              <button className="header-btn" onClick={() => navigate('/signin')}>Get Started</button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;