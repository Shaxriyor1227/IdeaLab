import { useState } from "react";
import { useAuth, userCache } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { FiUser, FiSettings, FiCheck, FiSun, FiMoon } from "react-icons/fi";
import { MdOutlineColorLens, MdTranslate, MdLogout } from "react-icons/md";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { auth, db } from "../../../firebase";
import "./SettingsPage.css";

export default function SettingsPage() {
  const { user, setUser, logout } = useAuth();
  const { theme, changeTheme, themes, mode, toggleMode } = useTheme();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  const [displayName, setDisplayName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleLanguageChange = async (newLocale) => {
    i18n.changeLanguage(newLocale);
    if (user?.uid) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { locale: newLocale });
      } catch (err) {
        console.error("Error updating language preference:", err);
      }
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!displayName.trim() || displayName === user?.name) return;
    if (displayName.length > 50) {
      alert(t("nameTooLong") || "Ism juda uzun, iltimos qisqaroq kiriting (max 50).");
      return;
    }

    setLoading(true);
    setSuccessMsg("");

    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Update Firebase Auth Profile
        await updateProfile(currentUser, { displayName: displayName });

        // Update Firestore User Doc
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, { name: displayName });

        // Update local context & cache immediately
        const updatedUser = { ...user, name: displayName };
        setUser(updatedUser);
        userCache.set(currentUser.uid, updatedUser);

        setSuccessMsg(t("settingsSavedMsg"));
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        
        {/* Header */}
        <div className="settings-header">
          <FiSettings className="settings-title-icon" size={32} />
          <div>
            <h1 className="settings-title">{t("settingsTitle")}</h1>
            <p className="settings-subtitle">{t("settingsSubtitle")}</p>
          </div>
        </div>

        <div className="settings-grid">
          
          {/* Main settings column */}
          <div className="settings-main">
            
            {/* Color Theme Selector Card */}
            <div className="settings-card">
              <div className="settings-card-header">
                <MdOutlineColorLens size={22} className="settings-card-icon" />
                <div>
                  <h3>{t("colorTheme")}</h3>
                  <p>{t("changeColorTheme")}</p>
                </div>
              </div>
              
              <div className="theme-options-grid">
                {Object.keys(themes).map((key) => {
                  const tData = themes[key];
                  const isSelected = theme === key;
                  return (
                    <button
                      key={key}
                      onClick={() => changeTheme(key)}
                      className={`theme-option-btn ${isSelected ? "theme-option-btn--active" : ""}`}
                      style={{ "--theme-color": tData.primaryColor }}
                      aria-label={`Select ${tData.name} theme`}
                    >
                      <span 
                        className="theme-color-dot" 
                        style={{ background: tData.gradient }}
                      />
                      <span className="theme-color-name">{tData.name}</span>
                      {isSelected && <FiCheck className="theme-check-icon" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dark / Light Mode Selector Card */}
            <div className="settings-card">
              <div className="settings-card-header">
                {mode === "dark" ? (
                  <FiMoon size={22} className="settings-card-icon" />
                ) : (
                  <FiSun size={22} className="settings-card-icon" />
                )}
                <div>
                  <h3>{t("themeMode")}</h3>
                  <p>{t("changeThemeMode")}</p>
                </div>
              </div>
              
              <div className="theme-mode-switcher">
                <button
                  onClick={toggleMode}
                  className={`mode-toggle-btn ${mode === "light" ? "mode-toggle-btn--light" : ""}`}
                  aria-label="Toggle dark and light mode"
                >
                  <div className="mode-toggle-switch">
                    <div className="mode-toggle-knob">
                      {mode === "light" ? <FiSun size={14} /> : <FiMoon size={14} />}
                    </div>
                  </div>
                  <span className="mode-toggle-lbl">
                    {mode === "light" 
                      ? (locale === "uz" ? "Kunduzgi" : "Light Mode") 
                      : (locale === "uz" ? "Tungi" : "Dark Mode")}
                  </span>
                </button>
              </div>
            </div>

            {/* Language Selection Card */}
            <div className="settings-card">
              <div className="settings-card-header">
                <MdTranslate size={22} className="settings-card-icon" />
                <div>
                  <h3>{t("language")}</h3>
                  <p>{t("changeLanguage")}</p>
                </div>
              </div>

              <div className="lang-options">
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`lang-option-btn ${locale === "en" ? "lang-option-btn--active" : ""}`}
                  aria-label="Change language to English"
                >
                  <span className="flag-icon" role="img" aria-label="US Flag">🇺🇸</span> English
                </button>
                <button
                  onClick={() => handleLanguageChange("uz")}
                  className={`lang-option-btn ${locale === "uz" ? "lang-option-btn--active" : ""}`}
                  aria-label="Change language to Uzbek"
                >
                  <span className="flag-icon" role="img" aria-label="Uzbekistan Flag">🇺🇿</span> O'zbekcha
                </button>
              </div>
            </div>

            {/* Profile Update Card */}
            <div className="settings-card">
              <div className="settings-card-header">
                <FiUser size={22} className="settings-card-icon" />
                <div>
                  <h3>{t("accountDetails")}</h3>
                  <p>Update your personal information</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="settings-form">
                 <div className="form-group">
                  <label htmlFor="settings-email">{t("emailAddress")}</label>
                  <input
                    id="settings-email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="settings-input settings-input--disabled"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="settings-display-name">{t("displayName")}</label>
                  <input
                    id="settings-display-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                    className="settings-input"
                    required
                  />
                </div>

                {successMsg && <div className="settings-success-alert">{successMsg}</div>}

                <button 
                  type="submit" 
                  disabled={loading || displayName === user?.name || !displayName.trim()} 
                  className="settings-save-btn"
                >
                  {loading ? "Updating..." : t("saveSettings")}
                </button>
              </form>
            </div>

            {/* Sign Out Card */}
            <div className="settings-card settings-card--danger">
              <div className="settings-card-header">
                <MdLogout size={22} className="settings-card-icon danger-icon" />
                <div>
                  <h3>{t("logoutTitle")}</h3>
                  <p>{t("logoutDesc")}</p>
                </div>
              </div>
              <button onClick={logout} className="settings-logout-btn">
                <MdLogout size={16} /> {t("logoutTitle")}
              </button>
            </div>

          </div>

          {/* Sidebar / Quick Info Card */}
          <div className="settings-sidebar">
            <div className="profile-quick-card">
              <div className="profile-avatar-wrapper">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="profile-avatar-img" width="80" height="80" />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <h2 className="profile-quick-name">{user?.name || "User"}</h2>
              <p className="profile-quick-email">{user?.email}</p>
              
              <div className="profile-meta-badges">
                <span className="meta-badge theme-badge">
                  Theme: {themes[theme]?.name || "Purple"}
                </span>
                <span className="meta-badge lang-badge">
                  Lang: {locale === "en" ? "English" : "O'zbek"}
                </span>
                <span className="meta-badge mode-badge">
                  Mode: {mode === "light" ? "Light" : "Dark"}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
