import { useNavigate, Link } from "react-router-dom";
import { FaInstagram, FaGithub, FaTelegramPlane, FaLinkedin } from "react-icons/fa";
import logo from "../../assets/logo.jpg";
import { useLanguage } from "../context/LanguageContext";
import "./Footer.css";

export default function Footer() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo-row" onClick={() => navigate("/")} style={{cursor: 'pointer'}}>
              <img src={logo} alt="IdeaLab logo" className="footer-logo" />
              <span className="footer-logo-text">IdeaLab</span>
            </div>
            <p className="footer-tagline">
              {t("footerTagline")}
            </p>
            <div className="footer-socials">
              <a href="https://www.instagram.com/shaxriyor1227" className="social-icon" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://github.com/Shaxriyor1227" className="social-icon" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
              <a href="https://t.me/@Rozmamatov_Shaxriyor" className="social-icon" target="_blank" rel="noopener noreferrer"><FaTelegramPlane /></a>
              <a href="https://linkedin.com/in/shaxriyor1227" className="social-icon" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            </div>
          </div>

          <div className="footer-links-group">
            <div className="footer-column">
              <h4 className="footer-col-title">{t("footerProduct")}</h4>
              <Link to="/features" className="footer-link">{t("features")}</Link>
              <Link to="/analyze" className="footer-link">{t("newAnalysis")}</Link>
              <Link to="#" className="footer-link">{t("footerIntegrations")}</Link>
              <Link to="#" className="footer-link">{t("footerPricing")}</Link>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-col-title">{t("footerResources")}</h4>
              <Link to="#" className="footer-link">{t("footerDocumentation")}</Link>
              <Link to="/blog" className="footer-link">{t("blog")}</Link>
              <Link to="#" className="footer-link">{t("footerCommunity")}</Link>
              <Link to="#" className="footer-link">{t("footerHelpCenter")}</Link>
            </div>

            <div className="footer-column">
              <h4 className="footer-col-title">{t("footerLegal")}</h4>
              <Link to="#" className="footer-link">{t("footerPrivacyPolicy")}</Link>
              <Link to="#" className="footer-link">{t("footerTermsOfService")}</Link>
              <Link to="#" className="footer-link">{t("footerCookiePolicy")}</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} IdeaLab Inc. {t("footerAllRightsReserved")}
          </p>
          <div className="footer-bottom-links">
            <span className="footer-status">
              <span className="status-dot"></span> {t("footerAllSystemsOperational")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
