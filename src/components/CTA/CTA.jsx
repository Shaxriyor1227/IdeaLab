import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { useAuth } from "../context/Authontext";
import "./CTA.css";

export default function CTA() {
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  const handleGetStarted = () => {
    if (isAuth) {
      navigate('/analyze');
    } else {
      navigate('/signin');
    }
  };

  return (
    <section className="cta-section">
      <div className="cta-card">
        <div className="cta-glow" />
        <h2 className="cta-title">Start validating for free</h2>
        <p className="cta-subtitle">
          Run your first idea through IdeaLab and get a market score, SWOT
          summary, competitor view, and recommended next experiments in under a
          minute.
        </p>
        <button className="cta-btn" onClick={handleGetStarted}>
          Get Started <HiArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}