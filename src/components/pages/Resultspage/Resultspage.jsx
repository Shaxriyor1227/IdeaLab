import { useLocation, useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { TbFileExport } from "react-icons/tb";
import { MdBookmark } from "react-icons/md";
import { RiShieldCheckLine, RiAlertLine, RiLightbulbLine, RiErrorWarningLine } from "react-icons/ri";
import "./ResultsPage.css";

const priorityColor = { High: "rp-high", Medium: "rp-medium", Low: "rp-low" };

const swotConfig = [
  { key: "strengths",    label: "Strengths",    icon: <RiShieldCheckLine size={16} />,  color: "rp-green"  },
  { key: "weaknesses",   label: "Weaknesses",   icon: <RiAlertLine size={16} />,        color: "rp-red"    },
  { key: "opportunities",label: "Opportunities",icon: <RiLightbulbLine size={16} />,    color: "rp-blue"   },
  { key: "threats",      label: "Threats",      icon: <RiErrorWarningLine size={16} />, color: "rp-yellow" },
];

export default function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.result) {
    navigate("/analyze");
    return null;
  }

  const { result, formData, analyzedAt } = state;

  return (
    <div className="rp-page">
      {/* Navbar */}
      <nav className="rp-nav">
        <span className="rp-nav-logo">IdeaLab</span>
        <div className="rp-nav-links">
          <span onClick={() => navigate("/")}>Dashboard</span>
          <span onClick={() => navigate("/analyze")}>New Analysis</span>
          <span>History</span>
        </div>
        <button className="rp-nav-export">
          <TbFileExport size={15} /> Export PDF
        </button>
      </nav>

      <div className="rp-content">
        {/* Back */}
        <button className="rp-back" onClick={() => navigate("/")}>
          <HiArrowLeft size={14} /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="rp-header">
          <div>
            <h1 className="rp-title">Idea Analysis</h1>
            <p className="rp-meta">{formData.startupName} · Analyzed {analyzedAt}</p>
          </div>
          <div className="rp-header-actions">
            <button className="rp-btn-outline"><TbFileExport size={15} /> Export PDF</button>
            <button className="rp-btn-purple"><MdBookmark size={15} /> Save to Dashboard</button>
          </div>
        </div>

        {/* Stats row */}
        <div className="rp-stats">
          {/* Viability Score */}
          <div className="rp-stat rp-stat--wide">
            <div className="rp-stat-top">
              <span className="rp-stat-label">Viability Score</span>
              <span className="rp-badge rp-badge--purple">{result.viabilityLabel}</span>
            </div>
            <div className="rp-score-row">
              <span className="rp-score-num">{result.viabilityScore}</span>
              <span className="rp-score-denom">/100</span>
            </div>
            <div className="rp-progress-bg">
              <div className="rp-progress-fill" style={{ width: `${result.viabilityScore}%` }} />
            </div>
            <p className="rp-stat-sub">Strong market fit with clear differentiation</p>
          </div>

          {/* Market Size */}
          <div className="rp-stat">
            <div className="rp-stat-top">
              <span className="rp-stat-label">Market Size</span>
              <span className="rp-stat-icon rp-teal">↗</span>
            </div>
            <p className="rp-stat-big">{result.marketSize}</p>
            <p className="rp-stat-sub rp-teal">{result.marketGrowth}</p>
          </div>

          {/* Competition */}
          <div className="rp-stat">
            <div className="rp-stat-top">
              <span className="rp-stat-label">Competition</span>
              <span className="rp-stat-icon rp-blue">≈</span>
            </div>
            <p className="rp-stat-big">{result.competition}</p>
            <p className="rp-stat-sub">{result.competitorCount} direct competitors</p>
          </div>

          {/* Trend Score */}
          <div className="rp-stat">
            <div className="rp-stat-top">
              <span className="rp-stat-label">Trend Score</span>
              <span className="rp-stat-icon rp-teal">↗</span>
            </div>
            <p className="rp-stat-big">{result.trendScore}</p>
            <p className="rp-stat-sub rp-teal">{result.trendLabel}</p>
          </div>
        </div>

        {/* SWOT */}
        <h2 className="rp-section-title">SWOT Analysis</h2>
        <div className="rp-swot">
          {swotConfig.map(({ key, label, icon, color }) => (
            <div className={`rp-swot-card rp-swot-card--${color.replace("rp-", "")}`} key={key}>
              <div className={`rp-swot-header ${color}`}>
                {icon} {label}
              </div>
              <ul className="rp-swot-list">
                {result.swot[key].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <button className="rp-view-details">View Details →</button>
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        <h2 className="rp-section-title">AI Recommendations</h2>
        <div className="rp-recs">
          {result.recommendations.map((rec, i) => (
            <div className="rp-rec-card" key={i}>
              <div className="rp-rec-num">{i + 1}</div>
              <div className="rp-rec-body">
                <p className="rp-rec-title">{rec.title}</p>
                <p className="rp-rec-desc">{rec.description}</p>
              </div>
              <span className={`rp-priority ${priorityColor[rec.priority]}`}>
                {rec.priority} Priority
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}