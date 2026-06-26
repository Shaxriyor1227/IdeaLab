import React from 'react';
import './IdeaAnalysis.css';

const IdeaAnalysis = () => {
  return (
    <section className="idea-analysis-section">
      <div className="browser-mockup">
        <div className="browser-header">
          <div className="browser-controls">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <div className="browser-url">idea-score/report</div>
        </div>

        <div className="browser-content">
          <div className="dashboard-container">
            <div className="dashboard-header">
              <div className="dashboard-title-section">
                <h2 className="dashboard-title">Idea Analysis</h2>
                <p className="dashboard-subtitle">SaaS tool for remote teams</p>
              </div>
              <div className="viability-score">
                <span className="score-label">VIABILITY SCORE</span>
                <span className="score-value">87/100</span>
              </div>
            </div>

            <div className="stats-row">
              <div className="stat-card market-size">
                <span className="stat-label">Market Size</span>
                <span className="stat-value blue">$2.4B</span>
                <span className="stat-change blue">+12% YoY</span>
              </div>
              <div className="stat-card competition">
                <span className="stat-label">Competition</span>
                <span className="stat-value purple">Medium</span>
                <span className="stat-change purple">14 competitors</span>
              </div>
              <div className="stat-card trend">
                <span className="stat-label">Trend Score</span>
                <span className="stat-value green">9.2/10</span>
                <span className="stat-change green">↑ Trending up</span>
              </div>
            </div>

            <div className="swot-row">
              <div className="swot-card strengths">
                <div className="swot-badge s-badge">S</div>
                <h4 className="swot-title">Strengths</h4>
                <div className="swot-lines">
                  <div className="swot-line"></div>
                  <div className="swot-line short"></div>
                  <div className="swot-line medium"></div>
                </div>
              </div>
              <div className="swot-card weaknesses">
                <div className="swot-badge w-badge">W</div>
                <h4 className="swot-title">Weaknesses</h4>
                <div className="swot-lines">
                  <div className="swot-line"></div>
                  <div className="swot-line short"></div>
                  <div className="swot-line medium"></div>
                </div>
              </div>
              <div className="swot-card opportunities">
                <div className="swot-badge o-badge">O</div>
                <h4 className="swot-title">Opportunities</h4>
                <div className="swot-lines">
                  <div className="swot-line"></div>
                  <div className="swot-line short"></div>
                  <div className="swot-line medium"></div>
                </div>
              </div>
              <div className="swot-card threats">
                <div className="swot-badge t-badge">T</div>
                <h4 className="swot-title">Threats</h4>
                <div className="swot-lines">
                  <div className="swot-line"></div>
                  <div className="swot-line short"></div>
                  <div className="swot-line medium"></div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default IdeaAnalysis;