import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Stats.css';

function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

const Stats = () => {
  const { t } = useTranslation();

  const { count: ideasCount, ref: ref1 } = useCountUp(10000);
  const { count: accuracyCount, ref: ref2 } = useCountUp(95);
  const { count: secCount, ref: ref3 } = useCountUp(60);

  return (
    <div className="stats-wrapper">
      <div className="stats-container">
        <div className="stat-card" ref={ref1}>
          <div className="stat-value">{ideasCount.toLocaleString()}+</div>
          <div className="stat-label">{t('statIdeas') || 'ideas validated'}</div>
        </div>

        <div className="stat-card" ref={ref2}>
          <div className="stat-value highlight-cyan">{accuracyCount}%</div>
          <div className="stat-label">{t('statAccuracy') || 'accuracy benchmark'}</div>
        </div>

        <div className="stat-card" ref={ref3}>
          <div className="stat-value highlight-purple">{secCount} sec</div>
          <div className="stat-label">{t('statSpeed') || 'average report time'}</div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
