import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authontext';
import './Hero.css';
import { MdSlowMotionVideo } from "react-icons/md";

const Hero = () => {
  const { isAuth } = useAuth();
  const navigate = useNavigate();

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
          AI startup validation, before you build
        </div>

        <h1 className="hero-title">
          Validate Your Startup<br />
          Idea in 60 Seconds
        </h1>

        <p className="hero-description">
          IdeaLab scores your concept, maps competitors, surfaces risks, and
          turns raw startup intuition into an investor-ready validation report.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary" onClick={handleGetStarted}>
            Get Started
            <span className="btn-arrow">→</span>
          </button>
          <button className="btn-secondary">
           <MdSlowMotionVideo />
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;