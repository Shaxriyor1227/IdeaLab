import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import "./Footer.css";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer-section">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo-wrap">
            <img src={logo} alt="IdeaLab logo" className="footer-logo" />
          </div>
          <span className="footer-copy">Build faster, validate smarter.</span>
        </div>

        <nav className="footer-nav">
          <button type="button" className="footer-link" onClick={() => navigate("/")}>Home</button>
          <button type="button" className="footer-link" onClick={() => navigate("/features")}>Features</button>
          <button type="button" className="footer-link" onClick={() => navigate("/how-it-works")}>How it works</button>
        </nav>

        <div className="footer-meta">
          <span>© {new Date().getFullYear()} IdeaLab</span>
        </div>
      </div>
    </footer>
  );
}
