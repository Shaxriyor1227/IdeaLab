import { useNavigate, Link } from "react-router-dom";
import { FaInstagram, FaGithub, FaTelegramPlane, FaLinkedin } from "react-icons/fa";
import logo from "../../assets/logo.jpg";
import "./Footer.css";

export default function Footer() {
  const navigate = useNavigate();

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
              AI-powered idea validation and deep code reviews. Build faster, validate smarter, and ship with absolute confidence.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-icon"><FaInstagram /></a>
              <a href="#" className="social-icon"><FaGithub /></a>
              <a href="#" className="social-icon"><FaTelegramPlane /></a>
              <a href="#" className="social-icon"><FaLinkedin /></a>
            </div>
          </div>

          <div className="footer-links-group">
            <div className="footer-column">
              <h4 className="footer-col-title">Product</h4>
              <Link to="/features" className="footer-link">Features</Link>
              <Link to="/analyze" className="footer-link">New Analysis</Link>
              <Link to="#" className="footer-link">Integrations</Link>
              <Link to="#" className="footer-link">Pricing</Link>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-col-title">Resources</h4>
              <Link to="#" className="footer-link">Documentation</Link>
              <Link to="#" className="footer-link">Blog</Link>
              <Link to="#" className="footer-link">Community</Link>
              <Link to="#" className="footer-link">Help Center</Link>
            </div>

            <div className="footer-column">
              <h4 className="footer-col-title">Legal</h4>
              <Link to="#" className="footer-link">Privacy Policy</Link>
              <Link to="#" className="footer-link">Terms of Service</Link>
              <Link to="#" className="footer-link">Cookie Policy</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} IdeaLab Inc. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <span className="footer-status">
              <span className="status-dot"></span> All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
