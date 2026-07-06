import { useTranslation } from 'react-i18next';
import './IdeaAnalysis.css';

const IdeaAnalysis = () => {
  const { t } = useTranslation();

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
                <h2 className="dashboard-title">{t('iaTitle')}</h2>
                <p className="dashboard-subtitle">{t('iaSubtitle')}</p>
              </div>
              <div className="viability-score">
                <span className="score-label">{t('iaViabilityScore')}</span>
                <span className="score-value">87/100</span>
              </div>
            </div>

            <div className="stats-row">
              <div className="stat-card market-size">
                <span className="stat-label">{t('marketSize')}</span>
                <span className="stat-value blue">$2.4B</span>
                <span className="stat-change blue">+12% YoY</span>
              </div>
              <div className="stat-card competition">
                <span className="stat-label">{t('competition')}</span>
                <span className="stat-value purple">{t('iaMedium')}</span>
                <span className="stat-change purple">{t('iaCompetitors')}</span>
              </div>
              <div className="stat-card trend">
                <span className="stat-label">{t('trendScore')}</span>
                <span className="stat-value green">9.2/10</span>
                <span className="stat-change green">{t('iaTrendingUp')}</span>
              </div>
            </div>

            <div className="swot-row">
              <div className="swot-card strengths">
                <div className="swot-badge s-badge">S</div>
                <h4 className="swot-title">{t('iaStrengths')}</h4>
                <div className="swot-lines">
                  <div className="swot-line"></div>
                  <div className="swot-line short"></div>
                  <div className="swot-line medium"></div>
                </div>
              </div>
              <div className="swot-card weaknesses">
                <div className="swot-badge w-badge">W</div>
                <h4 className="swot-title">{t('iaWeaknesses')}</h4>
                <div className="swot-lines">
                  <div className="swot-line"></div>
                  <div className="swot-line short"></div>
                  <div className="swot-line medium"></div>
                </div>
              </div>
              <div className="swot-card opportunities">
                <div className="swot-badge o-badge">O</div>
                <h4 className="swot-title">{t('iaOpportunities')}</h4>
                <div className="swot-lines">
                  <div className="swot-line"></div>
                  <div className="swot-line short"></div>
                  <div className="swot-line medium"></div>
                </div>
              </div>
              <div className="swot-card threats">
                <div className="swot-badge t-badge">T</div>
                <h4 className="swot-title">{t('iaThreats')}</h4>
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