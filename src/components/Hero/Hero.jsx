import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './Hero.css';
import { MdSlowMotionVideo } from "react-icons/md";

const Hero = () => {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleGetStarted = () => {
    if (isAuth) {
      navigate('/analyze');
    } else {
      navigate('/signin');
    }
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-badge">
          <span className="badge-icon">✨</span>
          {t('heroBadge')}
        </div>

        <h1 className="hero-title">
          {t('heroTitle')}
        </h1>

        <p className="hero-description">
          {t('heroSub')}
        </p>

        <div className="hero-buttons">
          <button className="btn-primary" onClick={handleGetStarted}>
            {t('heroBtn')}
            <span className="btn-arrow">→</span>
          </button>
          <button className="btn-secondary">
           <MdSlowMotionVideo />
            {t('watchDemo')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;