import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import "./CTA.css";

export default function CTA() {
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const { t } = useTranslation();

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
        <h2 className="cta-title">{t("ctaTitle")}</h2>
        <p className="cta-subtitle">
          {t("ctaSubtitle")}
        </p>
        <button className="cta-btn" onClick={handleGetStarted}>
          {t("getStarted")} <HiArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}