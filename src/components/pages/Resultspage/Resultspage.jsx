import { useLocation, useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { TbFileExport } from "react-icons/tb";
import { MdBookmark } from "react-icons/md";
import { 
  RiShieldCheckLine, 
  RiAlertLine, 
  RiLightbulbLine, 
  RiErrorWarningLine,
  RiStarFill
} from "react-icons/ri";
import { FiTrendingUp, FiActivity, FiGlobe } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";
import "./Resultspage.css";

const priorityColor = { High: "rp-high", Medium: "rp-medium", Low: "rp-low" };

const swotConfig = [
  { key: "strengths",    label: "Strengths",    icon: <RiShieldCheckLine size={18} />, color: "rp-green"  },
  { key: "weaknesses",   label: "Weaknesses",   icon: <RiAlertLine size={18} />,       color: "rp-orange" },
  { key: "opportunities",label: "Opportunities",icon: <RiLightbulbLine size={18} />,   color: "rp-cyan"   },
  { key: "threats",      label: "Threats",      icon: <RiErrorWarningLine size={18} />,color: "rp-yellow" },
];

export default function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  let analysisData = state;

  if (!analysisData) {
    const saved = localStorage.getItem("latestAnalysis");
    if (saved) {
      try {
        analysisData = JSON.parse(saved);
      } catch {
        analysisData = null;
      }
    }
  }

  if (!analysisData?.result) {
    navigate("/analyze");
    return null;
  }

  const { result, analyzedAt } = analysisData;

  return (
    <div className="rp-page">
      <div className="rp-container">
        
        {/* Header */}
        <button className="rp-back" onClick={() => navigate("/")}>
          <HiArrowLeft size={14} /> {t("backToDashboard")}
        </button>
        <div className="rp-header">
          <div className="rp-header-left">
            <h1 className="rp-title">{t("ideaAnalysisReport")}</h1>
            <p className="rp-subtitle">AI Code Reviewer · {t("analyzedDate")} {analyzedAt}</p>
          </div>
          <div className="rp-header-right">
            <button className="rp-btn-ghost" onClick={() => window.print()}><TbFileExport size={16} /> {t("exportPdf")}</button>
            <button className="rp-btn-primary" onClick={() => navigate('/history')}><MdBookmark size={16} /> {t("saveToHistory")}</button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="rp-metrics">
          {/* Card 1 - Viability Score */}
          <div className="rp-card rp-card-viability">
            <div className="rp-card-top">
              <span className="rp-card-label">{t("viabilityScore")}</span>
              <span className="rp-badge rp-badge-purple">{result.viabilityLabel}</span>
            </div>
            <div className="rp-viability-score">
              <span className="rp-score-main">{result.viabilityScore}</span>
              <span className="rp-score-sub">/100</span>
            </div>
            <div className="rp-progress-bar">
              <div className="rp-progress-fill" style={{ width: `${result.viabilityScore}%` }}></div>
            </div>
            <p className="rp-card-desc">{t("strongMarketFit")}</p>
          </div>

          {/* Card 2 - Market Size */}
          <div className="rp-card">
            <div className="rp-card-top">
              <span className="rp-card-label">{t("marketSize")}</span>
              <div className="rp-icon-blue"><FiGlobe size={18} /></div>
            </div>
            <div className="rp-metric-value rp-text-cyan">{result.marketSize}</div>
            <p className="rp-card-desc rp-text-green">{result.marketGrowth}</p>
          </div>

          {/* Card 3 - Competition */}
          <div className="rp-card">
            <div className="rp-card-top">
              <span className="rp-card-label">{t("competition")}</span>
              <div className="rp-icon-gray"><FiActivity size={18} /></div>
            </div>
            <div className="rp-metric-value rp-text-white">{result.competition}</div>
            <p className="rp-card-desc rp-text-gray">{result.competitorCount} {t("locale") === "uz" ? "ta bevosita raqobatchilar" : "direct competitors"}</p>
          </div>

          {/* Card 4 - Trend Score */}
          <div className="rp-card">
            <div className="rp-card-top">
              <span className="rp-card-label">{t("trendScore")}</span>
              <div className="rp-icon-cyan"><FiTrendingUp size={18} /></div>
            </div>
            <div className="rp-metric-value rp-text-white">{result.trendScore}</div>
            <p className="rp-card-desc rp-text-cyan">{result.trendLabel}</p>
          </div>
        </div>

        {/* SWOT Analysis */}
        <div className="rp-section">
          <h2 className="rp-section-title">{t("swotAnalysis")}</h2>
          <div className="rp-swot-grid">
            {swotConfig.map(({ key, label, icon, color }) => (
              <div className="rp-swot-card" key={key}>
                <div className={`rp-swot-header ${color}`}>
                  {icon} <h3>{t("locale") === "uz" ? (key.charAt(0).toUpperCase() + key.slice(1) === "Strengths" ? "Kuchli taraflari" : key.charAt(0).toUpperCase() + key.slice(1) === "Weaknesses" ? "Bo'sh taraflari" : key.charAt(0).toUpperCase() + key.slice(1) === "Opportunities" ? "Imkoniyatlar" : "Xavflar") : label}</h3>
                </div>
                <ul className="rp-swot-list">
                  {result.swot[key].map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <div className="rp-swot-footer">
                  <button 
                    className="rp-btn-ghost-purple"
                    onClick={() => navigate('/swot-detail', { state: { category: key, analysisData } })}
                  >
                    {t("viewDetails")} &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="rp-section">
          <h2 className="rp-section-title rp-recs-title">
            <RiStarFill className="rp-text-purple" size={20} /> {t("aiRecommendations")}
          </h2>
          <div className="rp-recs-list">
            {result.recommendations.map((rec, i) => (
              <div className="rp-rec-item" key={i}>
                <div className="rp-rec-num">{i + 1}</div>
                <div className="rp-rec-content">
                  <h4 className="rp-rec-heading">{rec.title}</h4>
                  <p className="rp-rec-text">{rec.description}</p>
                </div>
                <div className="rp-rec-priority">
                  <span className={`rp-priority-badge ${priorityColor[rec.priority]}`}>
                    {rec.priority} {t("priority")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}