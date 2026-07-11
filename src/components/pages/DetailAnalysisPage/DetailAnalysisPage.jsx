import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { 
  RiShieldCheckLine, 
  RiAlertLine, 
  RiLightbulbLine, 
  RiErrorWarningLine 
} from "react-icons/ri";
import { FaCheck, FaTimes } from "react-icons/fa";
import { BsLightningFill } from "react-icons/bs";
import "./DetailAnalysisPage.css";

const swotThemes = {
  strengths: { 
    color: "#10B981", 
    cssVar: "sp-green", 
    icon: RiShieldCheckLine, 
    title: "Strengths Analysis" 
  },
  weaknesses: { 
    color: "#f97316", 
    cssVar: "sp-orange", 
    icon: RiAlertLine, 
    title: "Weaknesses Analysis" 
  },
  opportunities: { 
    color: "#06B6D4", 
    cssVar: "sp-cyan", 
    icon: RiLightbulbLine, 
    title: "Opportunities Analysis" 
  },
  threats: { 
    color: "#eab308", 
    cssVar: "sp-yellow", 
    icon: RiErrorWarningLine, 
    title: "Threats Analysis" 
  }
};

const buildPrompt = (category, formData) => `
You are an expert startup analyst. Provide a deep-dive analysis on the "${category}" of the following startup idea. Return ONLY a valid JSON object. No markdown, no backticks, no explanation.

Startup name: ${formData.startupName}
One-line description: ${formData.oneLiner}
Problem: ${formData.problem}
Target customer: ${formData.targetCustomer}
Industry: ${formData.industry}

Return exactly this JSON structure:
{
  "score": <number 0-100>,
  "badge": "<e.g., Highly Differentiated / High Risk>",
  "description": "<short description about this ${category}>",
  "details": [
    {
      "title": "<short bold title>",
      "impactBadge": "<High Impact | Medium Impact>",
      "description": "<2 sentence explanation>",
      "metric": "<e.g., ⏱ Saves 8hrs/week, 📉 20% churn risk>"
    },
    ... (provide exactly 3 details)
  ],
  "competitors": ["Competitor A", "Competitor B"],
  "competitorComparison": [
    {
      "feature": "<feature name>",
      "ideaLab": <boolean true/false>,
      "competitor1": <boolean true/false>,
      "competitor2": <boolean true/false>
    },
    ... (provide exactly 4 features to compare)
  ],
  "leverageActions": [
    {
      "title": "<actionable title>",
      "description": "<how to leverage or mitigate>"
    },
    ... (provide exactly 2 actions)
  ]
}
`;

export default function DetailAnalysisPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const category = state?.category || "strengths";
  const analysisData = state?.analysisData;
  const theme = swotThemes[category];
  const IconComponent = theme.icon;

  useEffect(() => {
    if (!analysisData) {
      navigate("/analyze");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");
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
            messages: [
              {
                role: "user",
                content: buildPrompt(category, analysisData.formData),
              },
            ],
          }),
        });

        const resData = await response.json();
        if (!response.ok) {
          throw new Error(resData.error?.message || "API error");
        }

        const text = resData.choices[0].message.content;
        const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (!jsonMatch) throw new Error("AI format error");
        const clean = jsonMatch[0];
        setData(JSON.parse(clean));
      } catch (err) {
        console.error(err);
        setError("Analysis failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, analysisData, navigate]);

  if (!analysisData) return null;

  return (
    <div className="dp-page" style={{"--theme-color": theme.color}}>
      <div className="dp-container">
        
        {/* Header */}
        <div className="dp-header">
          <button className="dp-back-link" onClick={() => navigate("/results", { state: analysisData })}>
            <HiArrowLeft size={14} /> Back to Results
          </button>
          <div className="dp-title-area">
            <div className="dp-title-icon-box"><IconComponent size={24} /></div>
            <div>
              <h1 className="dp-title">{theme.title}</h1>
              <p className="dp-subtitle">AI Code Reviewer · Detailed breakdown</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="dp-loading-container">
             <div className="dp-btn-loading">
                <span className="dp-spinner-icon" />
                <span className="dp-loading-text">Deep Analyzing {category}...</span>
                <span className="dp-loading-dots">
                  <span>.</span><span>.</span><span>.</span>
                </span>
                <div className="dp-btn-scan-line"></div>
              </div>
          </div>
        ) : error ? (
          <div className="dp-error">{error}</div>
        ) : data ? (
          <>
            {/* Score Card */}
            <div className="dp-score-card">
              <div className="dp-score-top">
                <span className="dp-label-small">{category.toUpperCase()} SCORE</span>
                <span className="dp-badge-theme"><span className="dp-badge-dot"></span>{data.badge}</span>
              </div>
              <div className="dp-score-main">
                <span className="dp-score-number">{data.score}</span>
                <span className="dp-score-denom">/100</span>
              </div>
              <div className="dp-progress-bg">
                <div className="dp-progress-fill" style={{ width: `${data.score}%` }}></div>
              </div>
              <p className="dp-score-desc">Among the highest-rated dimensions in this analysis</p>
            </div>

            {/* Detail Cards */}
            <div className="dp-section">
              <h2 className="dp-section-title">Core {category.charAt(0).toUpperCase() + category.slice(1)}</h2>
              <div className="dp-details-section">
                {data.details.map((detail, i) => (
                  <div className="dp-detail-card" key={i}>
                    <div className="dp-detail-header">
                      <h3 className="dp-detail-title">{detail.title}</h3>
                      <span className={detail.impactBadge.includes("High") ? "dp-impact-badge-theme" : "dp-impact-badge-neutral"}>
                        {detail.impactBadge}
                      </span>
                    </div>
                    <p className="dp-detail-desc">{detail.description}</p>
                    <div className="dp-metric-box">
                      {detail.metric}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitor Comparison */}
            <div className="dp-section">
              <h2 className="dp-section-title">How these {category} compare</h2>
              <div className="dp-table-wrapper">
                <table className="dp-table">
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>IdeaLab</th>
                      <th>{data.competitors[0]}</th>
                      <th>{data.competitors[1]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.competitorComparison.map((comp, i) => (
                      <tr key={i}>
                        <td>{comp.feature}</td>
                        <td>{comp.ideaLab ? <FaCheck className="dp-icon-theme" /> : <FaTimes className="dp-icon-red" />}</td>
                        <td>{comp.competitor1 ? <FaCheck className="dp-icon-theme" /> : <FaTimes className="dp-icon-red" />}</td>
                        <td>{comp.competitor2 ? <FaCheck className="dp-icon-theme" /> : <FaTimes className="dp-icon-red" />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Leverage Actions */}
            <div className="dp-section">
              <h2 className="dp-section-title">Action Items</h2>
              <div className="dp-leverage-grid">
                {data.leverageActions.map((action, i) => (
                  <div className="dp-leverage-card" key={i}>
                    <div className="dp-leverage-icon"><BsLightningFill size={18} /></div>
                    <h4 className="dp-leverage-title">{action.title}</h4>
                    <p className="dp-leverage-desc">{action.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
