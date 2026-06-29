import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authontext';
import './Header.css';
import logo from '../../assets/logo.jpg';

const Header = () => {
  const { isAuth, logout, user } = useAuth();
  const navigate = useNavigate();

  const getLinkClass = ({ isActive }) => 
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
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
      </div>
    </header>
  );
};

export default Header;