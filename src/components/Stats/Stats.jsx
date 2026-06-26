import React from 'react';
import './Stats.css';

const Stats = () => {
  return (
    <div className="stats-wrapper">
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-value">10,000+</div>
          <div className="stat-label">ideas validated</div>
        </div>

        <div className="stat-card">
          <div className="stat-value highlight-cyan">95%</div>
          <div className="stat-label">accuracy benchmark</div>
        </div>

        <div className="stat-card">
          <div className="stat-value highlight-purple">60 sec</div>
          <div className="stat-label">average report time</div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
