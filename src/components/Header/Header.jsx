import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { TbFileExport } from 'react-icons/tb';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/Authontext';
import './Header.css';
import logo from '../../assets/logo.jpg';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuth, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getLinkClass = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link';

  const isAnalysisPage = location.pathname === '/results' || location.pathname === '/swot-detail' || location.pathname === '/history';

  const navItems = !isAnalysisPage ? (
    <>
      <NavLink to="/" className={getLinkClass} end onClick={() => setMobileMenuOpen(false)}>
        How it works
      </NavLink>
      <NavLink to="/features" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
        Features
      </NavLink>
      <NavLink to="/blog" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
        Blog
      </NavLink>
      {isAuth && (
        <>
          <NavLink to="/analyze" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
            Analyze
          </NavLink>
          <NavLink to="/results" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
            Result
          </NavLink>
        </>
      )}
    </>
  ) : (
    <>
      <NavLink to="/" className={getLinkClass} end onClick={() => setMobileMenuOpen(false)}>
        Dashboard
      </NavLink>
      <NavLink to="/blog" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
        Blog
      </NavLink>
      <NavLink to="/analyze" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
        New Analysis
      </NavLink>
      <NavLink to="/history" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
        History
      </NavLink>
    </>
  );

  const handlePrimaryAction = () => {
    if (isAnalysisPage) {
      window.print();
      return;
    }

    if (isAuth) {
      logout();
      setMobileMenuOpen(false);
      return;
    }

    navigate('/signin');
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo" onClick={() => { navigate('/'); setMobileMenuOpen(false); }}>
          <img src={logo} alt="IdeaLab Logo" className="logo-img" />
          <span className="logo-text">IdeaLab</span>
        </div>

        <nav className="header-nav">{navItems}</nav>

        <div className="header-actions">
          {isAnalysisPage ? (
            <button className="header-btn-ghost header-btn-ghost--desktop" onClick={() => window.print()}>
              <TbFileExport size={18} />
              Export PDF
            </button>
          ) : isAuth ? (
            <div className="user-profile-menu">
              <span className="user-name">{user?.name || 'User'}</span>
              <button className="header-btn logout-btn" onClick={logout}>Logout</button>
            </div>
          ) : (
            <button className="header-btn" onClick={() => navigate('/signin')}>Get Started</button>
          )}

          <button
            className="header-menu-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${mobileMenuOpen ? 'mobile-menu--open' : ''}`}>
        <div className="mobile-menu__content">
          <div className="mobile-menu__nav">{navItems}</div>

          <button className="mobile-menu__action" onClick={handlePrimaryAction}>
            {isAnalysisPage ? (
              <>
                <TbFileExport size={18} /> Export PDF
              </>
            ) : isAuth ? (
              'Logout'
            ) : (
              'Get Started'
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;