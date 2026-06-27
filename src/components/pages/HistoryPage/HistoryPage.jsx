import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft, HiOutlineTrash } from "react-icons/hi";
import { MdRocketLaunch, MdTrendingUp, MdOutlineHistory } from "react-icons/md";
import { RiSparklingLine } from "react-icons/ri";
import "./HistoryPage.css";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem("analysisHistory");
    if (raw) {
      try {
        setHistory(JSON.parse(raw));
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  const handleDelete = (id) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("analysisHistory", JSON.stringify(updated));
  };

  const handleView = (item) => {
    navigate("/results", { state: item });
  };

  const getScoreColor = (score) => {
    if (score >= 75) return "#10B981";
    if (score >= 50) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="hp-page">
      <div className="hp-container">

        {/* Header */}
        <div className="hp-header">
          <div className="hp-header-left">
            <div className="hp-title-row">
              <MdOutlineHistory size={32} className="hp-title-icon" />
              <h1 className="hp-title">Analysis History</h1>
            </div>
            <p className="hp-subtitle">All your past startup idea validations in one place.</p>
          </div>
          <button className="hp-new-btn" onClick={() => navigate("/analyze")}>
            <RiSparklingLine size={16} /> New Analysis
          </button>
        </div>

        {/* Stats Row */}
        {history.length > 0 && (
          <div className="hp-stats-row">
            <div className="hp-stat-card">
              <span className="hp-stat-value">{history.length}</span>
              <span className="hp-stat-label">Total Analyses</span>
            </div>
            <div className="hp-stat-card">
              <span className="hp-stat-value" style={{ color: "#10B981" }}>
                {history.filter(h => h.result.viabilityScore >= 75).length}
              </span>
              <span className="hp-stat-label">High Potential</span>
            </div>
            <div className="hp-stat-card">
              <span className="hp-stat-value" style={{ color: "#7C3AED" }}>
                {Math.round(history.reduce((acc, h) => acc + h.result.viabilityScore, 0) / history.length)}
              </span>
              <span className="hp-stat-label">Avg. Viability Score</span>
            </div>
          </div>
        )}

        {/* History Grid or Empty State */}
        {history.length === 0 ? (
          <div className="hp-empty">
            <div className="hp-empty-icon">
              <MdRocketLaunch size={48} />
            </div>
            <h2 className="hp-empty-title">No analyses yet</h2>
            <p className="hp-empty-desc">
              You haven't validated any startup ideas yet. Start your first analysis and it will appear here.
            </p>
            <button className="hp-new-btn" onClick={() => navigate("/analyze")}>
              <RiSparklingLine size={16} /> Start First Analysis
            </button>
          </div>
        ) : (
          <div className="hp-grid">
            {history.map((item) => (
              <div key={item.id} className="hp-card">
                {/* Card Top */}
                <div className="hp-card-top">
                  <div className="hp-card-info">
                    <h3 className="hp-card-title">{item.formData.startupName}</h3>
                    <p className="hp-card-oneliner">{item.formData.oneLiner || item.formData.industry}</p>
                  </div>
                  <div
                    className="hp-score-ring"
                    style={{ "--score-color": getScoreColor(item.result.viabilityScore) }}
                  >
                    <span className="hp-score-num">{item.result.viabilityScore}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="hp-card-tags">
                  {item.formData.industry && (
                    <span className="hp-tag">{item.formData.industry}</span>
                  )}
                  <span
                    className="hp-tag-badge"
                    style={{ color: getScoreColor(item.result.viabilityScore), borderColor: getScoreColor(item.result.viabilityScore) + "40" }}
                  >
                    {item.result.viabilityLabel}
                  </span>
                </div>

                {/* Quick Metrics */}
                <div className="hp-card-metrics">
                  <div className="hp-mini-metric">
                    <span className="hp-mini-label">Market</span>
                    <span className="hp-mini-value">{item.result.marketSize}</span>
                  </div>
                  <div className="hp-mini-metric">
                    <span className="hp-mini-label">Competition</span>
                    <span className="hp-mini-value">{item.result.competition}</span>
                  </div>
                  <div className="hp-mini-metric">
                    <span className="hp-mini-label">Trend</span>
                    <span className="hp-mini-value">{item.result.trendScore}</span>
                  </div>
                </div>

                {/* Date */}
                <p className="hp-card-date">Analyzed: {item.analyzedAt}</p>

                {/* Actions */}
                <div className="hp-card-actions">
                  <button className="hp-view-btn" onClick={() => handleView(item)}>
                    <MdTrendingUp size={15} /> View Report
                  </button>
                  <button className="hp-delete-btn" onClick={() => handleDelete(item.id)}>
                    <HiOutlineTrash size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
