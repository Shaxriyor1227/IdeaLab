import { useState, memo, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { TbFileExport } from 'react-icons/tb';
import {
  FiMenu, FiX, FiSettings, FiSun, FiMoon,
  FiLogOut, FiPlusCircle, FiClock, FiBookOpen,
  FiGlobe, FiChevronDown, FiShield
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import './Header.css';
import logo from '../../assets/logo.jpg';

const Header = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuth, logout, user, isAdmin } = useAuth();
  const { t, i18n } = useTranslation();
  const { mode, toggleMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const getLinkClass = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link';

  const isAnalysisPage =
    location.pathname === '/results' ||
    location.pathname === '/swot-detail' ||
    location.pathname === '/history';

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  };

  const initials = getInitials(user?.name || user?.email);

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
        {i18n.language === 'uz' ? 'Asosiy Sahifa' : 'Home'}
      </NavLink>
      <NavLink to="/blog" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
        {t('blog')}
      </NavLink>
      <NavLink to="/analyze" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
        {t('newAnalysis')}
      </NavLink>
      <NavLink to="/results" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
        {t('result') || (i18n.language === 'uz' ? 'Natijalar' : 'Results')}
      </NavLink>
      <NavLink to="/history" className={getLinkClass} onClick={() => setMobileMenuOpen(false)}>
        {t('history')}
      </NavLink>
    </>
  );

  const handleNav = (path) => {
    navigate(path);
    setProfileOpen(false);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout error:", e);
    }
    setProfileOpen(false);
    setMobileMenuOpen(false);
  };

  const switchLang = async () => {
    const next = i18n.language === 'uz' ? 'en' : 'uz';
    i18n.changeLanguage(next);
    if (user && user.uid) {
      try {
        await updateDoc(doc(db, "users", user.uid), { locale: next });
      } catch (e) {
        console.error("Failed to save language preference:", e);
      }
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <button className="header-logo" onClick={() => handleNav('/')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}>
          <img src={logo} alt="IdeaLab Logo" className="logo-img" width="42" height="42" />
          <span className="logo-text">IdeaLab</span>
        </button>

        {/* Desktop Nav */}
        <nav className="header-nav">{navItems}</nav>

        {/* Actions */}
        <div className="header-actions">
          {/* Theme toggle */}
          <button
            className="header-btn-ghost theme-toggle-btn"
            onClick={toggleMode}
            style={{ padding: '8px', display: 'flex', alignItems: 'center' }}
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {mode === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
          </button>

          {/* Analysis page export */}
          {location.pathname === '/results' && (
            <button className="header-btn-ghost header-btn-ghost--desktop" onClick={() => window.print()}>
              <TbFileExport size={18} />
              {t('exportPdf')}
            </button>
          )}

          {/* Auth: profile avatar dropdown OR get started */}
          {isAuth ? (
            <div className="hd-profile-wrap" ref={profileRef}>
              <button
                className="hd-avatar-btn"
                onClick={() => setProfileOpen((p) => !p)}
                aria-label="Profile menu"
              >
                <div className="hd-avatar">
                  {user?.photoURL
                    ? <img src={user.photoURL} alt="avatar" className="hd-avatar-img" />
                    : <span className="hd-avatar-initials">{initials}</span>
                  }
                  <span className="hd-avatar-online" />
                </div>
                <FiChevronDown
                  size={14}
                  className={`hd-chevron ${profileOpen ? 'hd-chevron--open' : ''}`}
                />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="hd-dropdown">
                  {/* User info */}
                  <div className="hd-dropdown-user">
                    <div className="hd-dropdown-avatar">
                      {user?.photoURL
                        ? <img src={user.photoURL} alt="avatar" className="hd-avatar-img" />
                        : <span className="hd-avatar-initials">{initials}</span>
                      }
                    </div>
                    <div className="hd-dropdown-userinfo">
                      <span className="hd-dropdown-name">{user?.name || 'User'}</span>
                      <span className="hd-dropdown-email">{user?.email || ''}</span>
                    </div>
                  </div>

                  <div className="hd-dropdown-divider" />

                  {/* Menu items */}
                  <button className="hd-dropdown-item" onClick={() => handleNav('/analyze')}>
                    <FiPlusCircle size={16} />
                    <span>{t('newAnalysis')}</span>
                  </button>
                  <button className="hd-dropdown-item" onClick={() => handleNav('/history')}>
                    <FiClock size={16} />
                    <span>{t('history') || 'History'}</span>
                  </button>
                  <button className="hd-dropdown-item" onClick={() => handleNav('/blog')}>
                    <FiBookOpen size={16} />
                    <span>{t('blog')}</span>
                  </button>

                  <div className="hd-dropdown-divider" />

                  {isAdmin && (
                    <button className="hd-dropdown-item" onClick={() => handleNav('/admin')} style={{ color: '#8b5cf6' }}>
                      <FiShield size={16} />
                      <span>{t('adminPanel') || 'Admin Panel'}</span>
                    </button>
                  )}

                  <button className="hd-dropdown-item" onClick={() => handleNav('/settings')}>
                    <FiSettings size={16} />
                    <span>{t('settings')}</span>
                  </button>
                  <button className="hd-dropdown-item" onClick={switchLang}>
                    <FiGlobe size={16} />
                    <span>
                      {i18n.language === 'uz' ? 'Switch to English' : "O'zbekchaga o'tish"}
                    </span>
                  </button>

                  <div className="hd-dropdown-divider" />

                  <button className="hd-dropdown-item hd-dropdown-item--danger" onClick={handleLogout}>
                    <FiLogOut size={16} />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="header-btn" onClick={() => navigate('/signin')}>
              {t('getStarted')}
            </button>
          )}

          {/* Mobile hamburger */}
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

      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'mobile-menu--open' : ''}`}>
        <div className="mobile-menu__content">
          {/* Mobile user info */}
          {isAuth && (
            <div className="mobile-menu__user">
              <div className="hd-avatar hd-avatar--sm">
                {user?.photoURL
                  ? <img src={user.photoURL} alt="avatar" className="hd-avatar-img" />
                  : <span className="hd-avatar-initials">{initials}</span>
                }
              </div>
              <div>
                <p className="mobile-menu__username">{user?.name || 'User'}</p>
                <p className="mobile-menu__useremail">{user?.email || ''}</p>
              </div>
            </div>
          )}

          <div className="mobile-menu__nav">{navItems}</div>

          <button
            className="mobile-menu__action"
            onClick={() => { toggleMode(); setMobileMenuOpen(false); }}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {mode === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
            {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>

          {isAuth && (
            <>
              {isAdmin && (
                <button
                  className="mobile-menu__action"
                  onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
                  style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#a78bfa' }}
                >
                  <FiShield size={18} /> Admin Panel
                </button>
              )}
              <button
                className="mobile-menu__action"
                onClick={() => { switchLang(); setMobileMenuOpen(false); }}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <FiGlobe size={18} />
                {i18n.language === 'uz' ? 'Switch to English' : "O'zbekchaga o'tish"}
              </button>
              <button
                className="mobile-menu__action"
                onClick={() => { navigate('/settings'); setMobileMenuOpen(false); }}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <FiSettings size={18} /> {t('settings')}
              </button>
              <button
                className="mobile-menu__action"
                onClick={handleLogout}
              >
                <FiLogOut size={18} /> {t('logout')}
              </button>
            </>
          )}

          {!isAuth && (
            <button className="mobile-menu__action" onClick={() => { navigate('/signin'); setMobileMenuOpen(false); }}>
              {t('getStarted')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
export default Header;