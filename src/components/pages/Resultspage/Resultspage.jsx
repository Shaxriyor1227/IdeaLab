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
import { FiTrendingUp, FiActivity, FiGlobe, FiX, FiExternalLink, FiPlusCircle, FiDollarSign } from "react-icons/fi";
import { RiBuildingLine, RiCheckLine } from "react-icons/ri";
import { MdRocketLaunch } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
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
  const [toastMessage, setToastMessage] = useState("");
  
  const [showRoiModal, setShowRoiModal] = useState(false);
  const [roiAmount, setRoiAmount] = useState("");
  const [roiResult, setRoiResult] = useState(null);
  const [roiLoading, setRoiLoading] = useState(false);
  const [roiError, setRoiError] = useState("");

  const { user } = useAuth();

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
    return (
      <div className="rp-page rp-page-empty">
        <div className="rp-empty-container">
          <div className="rp-empty-icon">
            <FiActivity size={48} />
          </div>
          <h2 className="rp-empty-title">
            {lang === "uz" ? "Hozircha tahlil yo'q" : "No Analysis Yet"}
          </h2>
          <p className="rp-empty-subtitle">
            {lang === "uz" 
              ? "G'oyangizni kiritib, uni sun'iy intellekt orqali baholang va to'liq hisobot oling." 
              : "Enter your idea to get it evaluated by AI and receive a full report."}
          </p>
          <button className="rp-btn-primary rp-empty-btn" onClick={() => navigate("/analyze")}>
            <FiPlusCircle size={18} />
            {lang === "uz" ? "Yangi tahlilni boshlash" : "Start New Analysis"}
          </button>
        </div>
      </div>
    );
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
          model: "nvidia/nemotron-3-super-120b-a12b:free",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "API error");

      const text = data.choices[0].message.content;
      const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (!jsonMatch) throw new Error("AI format error");
      const clean = jsonMatch[0];
      const parsed = JSON.parse(clean);
      setCompetitors(Array.isArray(parsed) ? parsed : parsed.competitors || []);
    } catch (err) {
      console.error(err);
      setCompError(lang === "uz" ? "Raqobatchilarni topishda xatolik. Qayta urinib ko'ring." : "Failed to find competitors. Please try again.");
    } finally {
      setCompLoading(false);
    }
  };

  const handleCalculateRoi = async () => {
    if (!roiAmount) return;
    setRoiLoading(true);
    setRoiError("");

    const ideaTitle = formData?.startupName || "startup idea";
    const ideaDesc = formData?.oneLiner || formData?.problem || "";

    const prompt = `You are a strict Venture Capital analyst. Calculate the realistic 1-year revenue and ROI for this startup idea given a specific investment amount.
Startup: ${ideaTitle}
Description: ${ideaDesc}
Investment Amount: $${roiAmount}

Return ONLY a valid JSON object. No markdown, no backticks.
{
  "revenue": "<realistic 1-year revenue, e.g. $15,000>",
  "roi": "<ROI percentage, e.g. +150%>",
  "explanation": "<1 short sentence explaining why in ${lang === 'uz' ? 'Uzbek' : 'English'}>"
}`;

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
          model: "nvidia/nemotron-3-super-120b-a12b:free",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "API error");

      const text = data.choices[0].message.content;
      const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (!jsonMatch) throw new Error("AI format error");
      const parsed = JSON.parse(jsonMatch[0]);
      setRoiResult(parsed);
    } catch (err) {
      console.error(err);
      setRoiError(lang === "uz" ? "Hisoblashda xatolik. Qayta urinib ko'ring." : "Failed to calculate. Please try again.");
    } finally {
      setRoiLoading(false);
    }
  };

  const handleSaveToHistory = async () => {
    if (!user) {
      setToastMessage(lang === "uz" ? "Saqlash uchun tizimga kiring!" : "Please login to save!");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }

    try {
      // Check if it already exists in history
      const q = query(
        collection(db, "users", user.uid, "analyses"),
        where("formData.startupName", "==", analysisData?.formData?.startupName || "")
      );
      const snapshot = await getDocs(q);
      
      const isDuplicate = snapshot.docs.some(doc => {
        const data = doc.data();
        return data.analysisId === analysisData.analysisId;
      });
      
      if (isDuplicate) {
        setToastMessage(lang === "uz" ? "Ushbu tahlil allaqachon tarixga saqlangan!" : "Already saved in history!");
        setTimeout(() => setToastMessage(""), 3000);
        return;
      }

      await addDoc(collection(db, "users", user.uid, "analyses"), {
        ...analysisData,
        createdAt: new Date().toISOString()
      });
      setToastMessage(lang === "uz" ? "Tarix bo'limiga saqlandi!" : "Saved to history!");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("Error saving to history:", err);
      setToastMessage(lang === "uz" ? "Xatolik yuz berdi" : "Error saving");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  return (
    <div className="rp-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="rp-toast">
          <RiCheckLine size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="rp-container">
        
        <button className="rp-back" onClick={() => navigate(-1)}>
          <HiArrowLeft size={16} /> {t("backToDashboard") || "Ortga qaytish"}
        </button>
        <div className="rp-header">
          <div className="rp-header-titles">
            <h1 className="rp-title">{formData?.startupName || "Loyiha Nomi"}</h1>
            <p className="rp-subtitle">{t("aiIdeaValidator") || "AI Idea Validator"} · {t("analyzedDate")} {analyzedAt}</p>
          </div>
          <div className="rp-header-right">
            <button className="rp-btn-ghost" onClick={() => window.print()}><TbFileExport size={16} /> {t("exportPdf")}</button>
            <button className="rp-btn-primary" onClick={handleSaveToHistory}>
              <MdBookmark size={16} /> {lang === "uz" ? "Tarixga saqlash" : "Save to History"}
            </button>
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
            <button className="rp-comp-btn" style={{ marginTop: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.2)' }} onClick={() => setShowRoiModal(true)}>
              <FiDollarSign size={14} />
              {lang === "uz" ? "ROI Hisoblash" : "Calculate ROI"}
            </button>
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
                  {(result?.swot?.[key] || []).map((item, i) => (
                    <li key={`${key}-${i}`}>{item}</li>
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
            {(result?.recommendations || []).map((rec, i) => (
              <div className="rp-rec-item" key={`rec-${i}`}>
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

      {/* --- PRINT ONLY LAYOUT --- */}
      <div className="rp-print-doc" id="rp-print-doc">        
        <div className="rp-print-header">
          <div className="rp-print-logo">
            <MdRocketLaunch size={28} />
            <span>IdeaLab AI Report</span>
          </div>
          <div className="rp-print-meta">
            <span>{t("analyzedDate")}: {analyzedAt || new Date().toLocaleDateString(lang === 'uz' ? 'uz-UZ' : 'en-US')}</span>
            <span>Startup: {formData?.startupName || '—'}</span>
          </div>
        </div>

        <div className="rp-print-divider" />

        <div className="rp-print-summary">
          <div className="rp-print-summary-item">
            <label>{t("industry") || "Industry"}:</label>
            <span>{formData?.industry || '—'}</span>
          </div>
          <div className="rp-print-summary-item">
            <label>{t("targetCustomer") || "Target Customer"}:</label>
            <span>{formData?.targetCustomer || '—'}</span>
          </div>
        </div>

        <div className="rp-print-scores">
          <h3>{t("overallResults") || "Overall Results"}</h3>
          <div className="rp-print-score-grid">
            <div className="rp-print-score-box">
              <span className="rp-print-score-val">{result?.viabilityScore}/100</span>
              <span className="rp-print-score-lbl">{t("viabilityScore") || "Viability Score"}</span>
            </div>
            <div className="rp-print-score-box">
              <span className="rp-print-score-val">{result?.marketSize}</span>
              <span className="rp-print-score-lbl">{t("marketSize") || "Market Size"}</span>
            </div>
          </div>
        </div>

        <div className="rp-print-swot">
          <h3>{t("swotAnalysis") || "SWOT Analysis"}</h3>
          <table className="rp-print-table">
            <tbody>
              <tr>
                <td style={{ width: '50%', verticalAlign: 'top' }}>
                  <h4 style={{ color: '#10b981', margin: '0 0 10px' }}>{lang === 'uz' ? 'Kuchli tomonlar' : 'Strengths'}</h4>
                  <ul className="rp-print-list">
                    {(result?.swot?.strengths || []).map((item, i) => <li key={`print-s-${i}`}>{item}</li>)}
                  </ul>
                </td>
                <td style={{ width: '50%', verticalAlign: 'top' }}>
                  <h4 style={{ color: '#f59e0b', margin: '0 0 10px' }}>{lang === 'uz' ? 'Kuchsiz tomonlar' : 'Weaknesses'}</h4>
                  <ul className="rp-print-list">
                    {(result?.swot?.weaknesses || []).map((item, i) => <li key={`print-w-${i}`}>{item}</li>)}
                  </ul>
                </td>
              </tr>
              <tr>
                <td style={{ width: '50%', verticalAlign: 'top' }}>
                  <h4 style={{ color: '#06b6d4', margin: '0 0 10px' }}>{lang === 'uz' ? 'Imkoniyatlar' : 'Opportunities'}</h4>
                  <ul className="rp-print-list">
                    {(result?.swot?.opportunities || []).map((item, i) => <li key={`print-o-${i}`}>{item}</li>)}
                  </ul>
                </td>
                <td style={{ width: '50%', verticalAlign: 'top' }}>
                  <h4 style={{ color: '#ef4444', margin: '0 0 10px' }}>{lang === 'uz' ? 'Xavflar' : 'Threats'}</h4>
                  <ul className="rp-print-list">
                    {(result?.swot?.threats || []).map((item, i) => <li key={`print-t-${i}`}>{item}</li>)}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rp-print-recs">
          <h3>{t("aiRecommendations") || "AI Recommendations"}</h3>
          <div className="rp-print-recs-list">
            {(result?.recommendations || []).map((rec, i) => (
              <div className="rp-print-rec-item" key={`print-rec-${i}`}>
                <div className="rp-print-rec-title">
                  <strong>{i + 1}. {rec.title}</strong>
                  <span>({rec.priority} Priority)</span>
                </div>
                <p className="rp-print-rec-desc">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rp-print-footer">
          <p>{t("confidentialReport") || "Confidential Report generated by IdeaLab"} — {new Date().getFullYear()}</p>
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

      {/* ROI Modal */}
      {showRoiModal && (
        <div className="rp-modal-overlay" onClick={() => setShowRoiModal(false)}>
          <div className="rp-modal" onClick={e => e.stopPropagation()}>
            <div className="rp-modal-header">
              <div className="rp-modal-title-group">
                <FiDollarSign size={20} className="rp-text-green" />
                <h3 className="rp-modal-title">
                  {lang === "uz" ? "ROI va Daromadni Hisoblash" : "Calculate ROI & Revenue"}
                </h3>
              </div>
              <button className="rp-modal-close" onClick={() => setShowRoiModal(false)}>
                <FiX size={20} />
              </button>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#A0AEC0", fontSize: "14px" }}>
                {lang === "uz" ? "Qancha sarmoya kiritmoqchisiz? (Masalan: 5000)" : "How much will you invest? (e.g. 5000)"}
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input 
                  type="number" 
                  value={roiAmount}
                  onChange={(e) => setRoiAmount(e.target.value)}
                  placeholder={lang === "uz" ? "Summani kiriting..." : "Enter amount..."}
                  style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "white", outline: "none" }}
                />
                <button 
                  onClick={handleCalculateRoi}
                  disabled={roiLoading || !roiAmount}
                  style={{ padding: "10px 20px", borderRadius: "8px", background: "#10B981", color: "white", border: "none", fontWeight: "600", cursor: roiLoading || !roiAmount ? "not-allowed" : "pointer", opacity: roiLoading || !roiAmount ? 0.6 : 1 }}
                >
                  {roiLoading ? (lang === "uz" ? "Hisoblanmoqda..." : "Calculating...") : (lang === "uz" ? "Hisoblash" : "Calculate")}
                </button>
              </div>
            </div>

            {roiError && (
              <div className="rp-comp-error" style={{ marginBottom: "20px" }}>
                <RiErrorWarningLine size={24} />
                <p>{roiError}</p>
              </div>
            )}

            {roiResult && !roiLoading && (
              <div style={{ padding: "16px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "12px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#A0AEC0", marginBottom: "4px" }}>{lang === "uz" ? "Taxminiy Daromad (1 yil):" : "Estimated Revenue (1 yr):"}</div>
                    <div style={{ fontSize: "20px", fontWeight: "700", color: "#10B981" }}>{roiResult.revenue}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "12px", color: "#A0AEC0", marginBottom: "4px" }}>{lang === "uz" ? "Kutilayotgan ROI:" : "Expected ROI:"}</div>
                    <div style={{ fontSize: "20px", fontWeight: "700", color: "#10B981" }}>{roiResult.roi}</div>
                  </div>
                </div>
                <div style={{ paddingTop: "12px", borderTop: "1px solid rgba(16, 185, 129, 0.2)", fontSize: "14px", color: "#E2E8F0", lineHeight: "1.5" }}>
                  <RiLightbulbLine style={{ display: "inline", marginRight: "6px", color: "#10B981" }} />
                  {roiResult.explanation}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}