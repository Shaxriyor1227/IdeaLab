import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
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
import { FiTrendingUp, FiActivity, FiGlobe, FiX, FiExternalLink } from "react-icons/fi";
import { RiBuildingLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [showCompModal, setShowCompModal] = useState(false);
  const [competitors, setCompetitors] = useState(null);
  const [compLoading, setCompLoading] = useState(false);
  const [compError, setCompError] = useState("");

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

  const { result, analyzedAt, formData } = analysisData;

  const handleShowCompetitors = async () => {
    setShowCompModal(true);
    // If we already fetched, don't refetch
    if (competitors !== null) return;

    setCompLoading(true);
    setCompError("");

    const ideaTitle = formData?.startupName || result?.trendLabel || "startup idea";
    const ideaDesc = formData?.oneLiner || formData?.problem || "";
    const industry = formData?.industry || "";

    const prompt = `You are a startup market analyst. Find 3 real, well-known competitor companies for the following startup idea.

Startup: ${ideaTitle}
Description: ${ideaDesc}
Industry: ${industry}

Return ONLY a valid JSON array. No markdown, no explanation. Exactly this format:
[
  {
    "name": "<Real company name>",
    "type": "<Product category, e.g. SaaS Platform>",
    "founded": "<year>",
    "funding": "<e.g. $50M or Bootstrapped or IPO>",
    "desc": "<One clear sentence: what they do and their scale>",
    "logo": "<1-2 uppercase initials>",
    "url": "<official website domain, e.g. notion.so>"
  },
  { ... },
  { ... }
]`;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "IdeaLab",
        },
        body: JSON.stringify({
          model: "laguna-m.1:free",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "API error");

      const text = data.choices[0].message.content;
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setCompetitors(Array.isArray(parsed) ? parsed : parsed.competitors || []);
    } catch (err) {
      console.error(err);
      setCompError(lang === "uz" ? "Raqobatchilarni topishda xatolik. Qayta urinib ko'ring." : "Failed to find competitors. Please try again.");
    } finally {
      setCompLoading(false);
    }
  };

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
            <p className="rp-card-desc rp-text-gray">{result.competitorCount} {lang === "uz" ? "ta bevosita raqobatchilar" : "direct competitors"}</p>
            <button className="rp-comp-btn" onClick={handleShowCompetitors}>
              <RiBuildingLine size={14} />
              {lang === "uz" ? "Raqobatchilarni topish" : "Find Competitors"}
            </button>
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
                  {icon} <h3>{lang === "uz" ? (key === "strengths" ? "Kuchli tomonlar" : key === "weaknesses" ? "Kuchsiz tomonlar" : key === "opportunities" ? "Imkoniyatlar" : "Xavflar") : label}</h3>
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

      {/* Competitor Modal */}
      {showCompModal && (
        <div className="rp-modal-overlay" onClick={() => setShowCompModal(false)}>
          <div className="rp-modal" onClick={e => e.stopPropagation()}>
            <div className="rp-modal-header">
              <div className="rp-modal-title-group">
                <FiActivity size={20} className="rp-text-purple" />
                <h3 className="rp-modal-title">
                  {lang === "uz" ? "Asosiy raqobatchilar" : "Key Competitors"}
                </h3>
              </div>
              <button className="rp-modal-close" onClick={() => setShowCompModal(false)}>
                <FiX size={20} />
              </button>
            </div>

            <p className="rp-modal-subtitle">
              {lang === "uz"
                ? `"${formData?.startupName || 'G\'oyangiz'}" uchun AI tomonidan topilgan haqiqiy raqobatchilar:`
                : `Real competitors found by AI for "${formData?.startupName || 'your idea'}":`}
            </p>

            {/* Loading state */}
            {compLoading && (
              <div className="rp-comp-loading">
                <div className="rp-comp-spinner" />
                <p>{lang === "uz" ? "AI raqobatchilarni qidirmoqda..." : "AI is searching for competitors..."}</p>
              </div>
            )}

            {/* Error state */}
            {compError && !compLoading && (
              <div className="rp-comp-error">
                <p>{compError}</p>
                <button className="rp-comp-retry" onClick={() => { setCompetitors(null); handleShowCompetitors(); }}>
                  {lang === "uz" ? "Qayta urinish" : "Try Again"}
                </button>
              </div>
            )}

            {/* Competitors list */}
            {!compLoading && !compError && competitors && (
              <div className="rp-comp-list">
                {competitors.map((comp, i) => (
                  <div className="rp-comp-item" key={i}>
                    <div className="rp-comp-logo">{comp.logo || comp.name?.slice(0, 2).toUpperCase()}</div>
                    <div className="rp-comp-info">
                      <div className="rp-comp-name-row">
                        <span className="rp-comp-name">{comp.name}</span>
                        <span className="rp-comp-badge">{comp.type}</span>
                      </div>
                      <p className="rp-comp-desc">{comp.desc}</p>
                      <div className="rp-comp-meta">
                        <span>📅 {lang === "uz" ? "Tashkil:" : "Founded:"} {comp.founded}</span>
                        <span>💰 {lang === "uz" ? "Moliyalashtirish:" : "Funding:"} {comp.funding}</span>
                        {comp.url && (
                          <a
                            href={`https://${comp.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rp-comp-link"
                          >
                            <FiExternalLink size={12} />
                            {comp.url}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="rp-modal-footer">
              <p className="rp-modal-note">
                {lang === "uz"
                  ? "* Bu raqobatchilar AI tomonidan g'oyangiz asosida real vaqtda topilgan"
                  : "* These competitors were found in real-time by AI based on your specific idea"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}