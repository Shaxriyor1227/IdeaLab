import { useNavigate } from "react-router-dom";
import { LuBrain, LuCircleGauge, LuChartNetwork, LuShieldCheck, LuFileDown } from "react-icons/lu";
import { RiSparklingLine, RiTimeLine } from "react-icons/ri";
import { useState, useEffect, useRef } from "react";
import { MdCheckCircle } from "react-icons/md";
import { HiArrowRight } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import "./FeaturesPage.css";

const featureConfig = [
  { icon: <LuBrain size={32} />, accent: "purple", reverse: false },
  { icon: <LuCircleGauge size={32} />, accent: "cyan", reverse: true },
  { icon: <LuChartNetwork size={32} />, accent: "violet", reverse: false },
  { icon: <LuShieldCheck size={32} />, accent: "purple", reverse: true },
  { icon: <RiTimeLine size={32} />, accent: "cyan", reverse: false },
  { icon: <LuFileDown size={32} />, accent: "violet", reverse: true },
];

const CountUp = ({ end, duration = 2000, suffix = "", prefix = "", decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    let observer;
    if (nodeRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            let startTimestamp = null;
            const step = (timestamp) => {
              if (!startTimestamp) startTimestamp = timestamp;
              // Easing function for smoother animation (easeOutExpo)
              const progress = Math.min((timestamp - startTimestamp) / duration, 1);
              const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
              setCount(easeProgress * end);
              if (progress < 1) {
                window.requestAnimationFrame(step);
              } else {
                setCount(end); // Ensure it ends exactly on target
              }
            };
            window.requestAnimationFrame(step);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(nodeRef.current);
    }
    return () => {
      if (observer) observer.disconnect();
    };
  }, [end, duration]);

  return <strong ref={nodeRef}>{prefix}{count.toFixed(decimals)}{suffix}</strong>;
};

export default function FeaturesPage() {
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const { t } = useTranslation();
  
  const translatedFeatures = t('featuresData', { returnObjects: true }) || [];
  
  const featureRows = featureConfig.map((config, index) => ({
    ...config,
    ...(translatedFeatures[index] || {}),
  }));

  return (
    <section className="fp-section">

      {/* Intro */}
      <div className="fp-intro">
        <span className="fp-eyebrow">
          <RiSparklingLine size={13} /> {t('features')}
        </span>
        <h1 className="fp-main-title">
          {t('featuresTitle')}
        </h1>
        <p className="fp-main-subtitle">
          {t('featuresSubtitle')}
        </p>
        <div className="fp-intro-stats">
          <div className="fp-stat-pill"><CountUp end={60} suffix="s" /><span>{t('fullAnalysisTime')}</span></div>
          <div className="fp-stat-divider" />
          <div className="fp-stat-pill"><CountUp end={6} /><span>{t('aiModulesCount')}</span></div>
          <div className="fp-stat-divider" />
          <div className="fp-stat-pill"><CountUp end={10} suffix="K+" /><span>{t('ideasValidatedText')}</span></div>
          <div className="fp-stat-divider" />
          <div className="fp-stat-pill"><CountUp end={4.9} decimals={1} suffix="★" /><span>{t('userRating')}</span></div>
        </div>
      </div>

      {/* Feature Rows */}
      <div className="fp-rows">
        {featureRows.map((f, i) => (
          <div className={`fp-row ${f.reverse ? "fp-row--reverse" : ""}`} key={i}>
            {/* Visual Side */}
            <div className={`fp-visual fp-visual--${f.accent}`}>
              <div className={`fp-visual-icon fp-visual-icon--${f.accent}`}>{f.icon}</div>
              <ul className="fp-points-list">
                {f.points.map((p, j) => (
                  <li key={j}>
                    <MdCheckCircle className={`fp-check fp-check--${f.accent}`} size={16} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Text Side */}
            <div className="fp-text">
              <span className={`fp-label fp-label--${f.accent}`}>{f.label}</span>
              <h2 className="fp-row-title">{f.title}</h2>
              <p className="fp-row-body">{f.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="fp-cta">
        <span className="fp-cta-tag">{t('getStarted')}</span>
        <h3 className="fp-cta-title">{t('stopGuessing')}</h3>
        <p className="fp-cta-body">
          {t('stopGuessingDesc')}
        </p>
        <div className="fp-cta-actions">
          <button className="fp-cta-btn-primary" onClick={() => navigate(isAuth ? "/analyze" : "/signin")}>
            {t('btnAnalyzeMyIdea')} <HiArrowRight size={16} />
          </button>
          <button className="fp-cta-btn-ghost" onClick={() => navigate(isAuth ? "/history" : "/signin")}>
            {t('history')}
          </button>
        </div>
      </div>
    </section>
  );
}