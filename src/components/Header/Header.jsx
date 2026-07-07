import { useState, memo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { TbFileExport } from 'react-icons/tb';
import { FiMenu, FiX, FiSettings, FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import './Header.css';
import logo from '../../assets/logo.jpg';

const Header = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuth, logout, user } = useAuth();
  const { t } = useTranslation();
  const { mode, toggleMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getLinkClass = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link';

  const isAnalysisPage = location.pathname === '/results' || location.pathname === '/swot-detail' || location.pathname === '/history';

  const navItems = !isAnalysisPage ? (
    <>
      <NavLink to="/" className={getLinkClass} end onClick={() => setMobileMenuOpen(false)}>
        {t('howItWorks')}
      </NavLink>
      <NavLink to="/features" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
        {t('features')}
      </NavLink>
      <NavLink to="/blog" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
        {t('blog')}
      </NavLink>
      {isAuth && (
        <>
          <NavLink to="/analyze" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
            {t('analyze')}
          </NavLink>
          <NavLink to="/results" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
            {t('result')}
          </NavLink>
        </>
      )}
    </>
  ) : (
    <>
      <NavLink to="/" className={getLinkClass} end onClick={() => setMobileMenuOpen(false)}>
        {t('dashboard')}
      </NavLink>
      <NavLink to="/blog" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
        {t('blog')}
      </NavLink>
      <NavLink to="/analyze" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
        {t('newAnalysis')}
      </NavLink>
      <NavLink to="/history" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
        {t('history')}
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
          <img src={logo} alt="IdeaLab Logo" className="logo-img" width="42" height="42" />
          <span className="logo-text">IdeaLab</span>
        </div>

        <nav className="header-nav">{navItems}</nav>

        <div className="header-actions">
          <button 
            className="header-btn-ghost theme-toggle-btn" 
            onClick={toggleMode}
            style={{ padding: '8px', display: 'flex', alignItems: 'center' }}
            title="Toggle Theme Mode"
            aria-label="Toggle Theme Mode"
          >
            {mode === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
          </button>

          {isAnalysisPage ? (
            <button className="header-btn-ghost header-btn-ghost--desktop" onClick={() => window.print()}>
              <TbFileExport size={18} />
              {t('exportPdf')}
            </button>
          ) : isAuth ? (
            <div className="user-profile-menu">
              <span className="user-name" onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }}>
                {user?.name || 'User'}
              </span>
              <button 
                className="header-btn-ghost" 
                onClick={() => navigate('/settings')}
                style={{ padding: '8px', display: 'flex', alignItems: 'center' }}
                title={t('settings')}
                aria-label={t('settings') || 'Settings'}
              >
                <FiSettings size={18} />
              </button>
              <button className="header-btn logout-btn" onClick={logout}>{t('logout')}</button>
            </div>
          ) : (
            <button className="header-btn" onClick={() => navigate('/signin')}>{t('getStarted')}</button>
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

          <button 
            className="mobile-menu__action" 
            onClick={() => { toggleMode(); setMobileMenuOpen(false); }}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {mode === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />} {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>

          {isAuth && (
            <button 
              className="mobile-menu__action" 
              onClick={() => { navigate('/settings'); setMobileMenuOpen(false); }}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <FiSettings size={18} /> {t('settings')}
            </button>
          )}

          <button className="mobile-menu__action" onClick={handlePrimaryAction}>
            {isAnalysisPage ? (
              <>
                <TbFileExport size={18} /> {t('exportPdf')}
              </>
            ) : isAuth ? (
              t('logout')
            ) : (
              t('getStarted')
            )}
          </button>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;