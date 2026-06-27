import { useNavigate } from "react-router-dom";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { TbFileExport } from "react-icons/tb";
import { RiShieldCheckLine } from "react-icons/ri";
import { FaCheck, FaTimes } from "react-icons/fa";
import { BsLightningFill, BsGraphUp } from "react-icons/bs";
import "./Strengthspage.css";

export default function Strengthspage() {
  const navigate = useNavigate();

  return (
    <div className="sp-page">
      <div className="sp-container">
        
        {/* Navbar */}
        <div className="sp-navbar">
          <div className="sp-nav-left">
            <span className="sp-logo">IdeaLab</span>
          </div>
          <div className="sp-nav-center">
            <span onClick={() => navigate("/")}>Dashboard</span>
            <span onClick={() => navigate("/analyze")}>New Analysis</span>
            <span>History</span>
          </div>
          <div className="sp-nav-right">
            <button className="sp-nav-export"><TbFileExport size={15} /> Export PDF</button>
          </div>
        </div>

        {/* Header */}
        <div className="sp-header">
          <button className="sp-back-link" onClick={() => navigate("/results")}>
            <HiArrowLeft size={14} /> Back to Results
          </button>
          <div className="sp-title-area">
            <div className="sp-title-icon-box"><RiShieldCheckLine size={24} /></div>
            <div>
              <h1 className="sp-title">Strengths Analysis</h1>
              <p className="sp-subtitle">AI Code Reviewer · Detailed breakdown</p>
            </div>
          </div>
        </div>

        {/* Strength Score Card */}
        <div className="sp-score-card">
          <div className="sp-score-top">
            <span className="sp-label-small">STRENGTH SCORE</span>
            <span className="sp-badge-green">Highly Differentiated</span>
          </div>
          <div className="sp-score-main">
            <span className="sp-score-number">94</span>
            <span className="sp-score-denom">/100</span>
          </div>
          <div className="sp-progress-bg">
            <div className="sp-progress-fill" style={{ width: "94%" }}></div>
          </div>
          <p className="sp-score-desc">Your strengths give strong competitive advantage</p>
        </div>

        {/* Strength Detail Cards */}
        <div className="sp-details-section">
          
          <div className="sp-detail-card">
            <div className="sp-detail-header">
              <div className="sp-detail-title-wrap">
                <span className="sp-dot-green"></span>
                <h3 className="sp-detail-title">Clear differentiation through AI-driven automation</h3>
              </div>
              <span className="sp-impact-badge-green">High Impact</span>
            </div>
            <p className="sp-detail-desc">
              Your AI-driven approach automates code review workflows that competitors handle manually. This creates measurable time savings and positions IdeaLab as a productivity multiplier rather than just another tool.
            </p>
            <div className="sp-metric-box">
              ⏱ Saves 8hrs/week per developer
            </div>
          </div>

          <div className="sp-detail-card">
            <div className="sp-detail-header">
              <div className="sp-detail-title-wrap">
                <span className="sp-dot-green"></span>
                <h3 className="sp-detail-title">Low operating costs with high gross margins</h3>
              </div>
              <span className="sp-impact-badge-green">High Impact</span>
            </div>
            <p className="sp-detail-desc">
              Infrastructure costs remain low relative to revenue potential. AI-first architecture enables scaling without proportional headcount growth, creating strong unit economics from early stages.
            </p>
            <div className="sp-metric-box">
              📈 Est. 78% gross margin at scale
            </div>
          </div>

          <div className="sp-detail-card">
            <div className="sp-detail-header">
              <div className="sp-detail-title-wrap">
                <span className="sp-dot-green"></span>
                <h3 className="sp-detail-title">Strong founder expertise in developer tooling</h3>
              </div>
              <span className="sp-impact-badge-cyan">Medium Impact</span>
            </div>
            <p className="sp-detail-desc">
              Deep domain knowledge reduces product-market fit risk. Founders who have lived the problem build better solutions and earn faster trust from technical buyers.
            </p>
            <div className="sp-metric-box">
              🏆 5+ years domain experience
            </div>
          </div>

        </div>

        {/* Competitor Comparison */}
        <div className="sp-section">
          <h2 className="sp-section-title">How these strengths compare to competitors</h2>
          <div className="sp-table-wrapper">
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>IdeaLab</th>
                  <th>QuickBooks</th>
                  <th>Bench</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>AI Automation</td>
                  <td><FaCheck className="sp-icon-green" /></td>
                  <td><FaTimes className="sp-icon-red" /></td>
                  <td><FaTimes className="sp-icon-red" /></td>
                </tr>
                <tr>
                  <td>Low Cost</td>
                  <td><FaCheck className="sp-icon-green" /></td>
                  <td><FaTimes className="sp-icon-red" /></td>
                  <td><FaCheck className="sp-icon-green" /></td>
                </tr>
                <tr>
                  <td>Dev Expertise</td>
                  <td><FaCheck className="sp-icon-green" /></td>
                  <td><FaCheck className="sp-icon-green" /></td>
                  <td><FaTimes className="sp-icon-red" /></td>
                </tr>
                <tr>
                  <td>Fast Setup</td>
                  <td><FaCheck className="sp-icon-green" /></td>
                  <td><FaTimes className="sp-icon-red" /></td>
                  <td><FaTimes className="sp-icon-red" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Leverage Actions */}
        <div className="sp-section">
          <h2 className="sp-section-title">How to leverage these strengths</h2>
          <div className="sp-leverage-grid">
            <div className="sp-leverage-card">
              <div className="sp-leverage-icon"><BsLightningFill size={18} /></div>
              <h4 className="sp-leverage-title">Double down on AI automation</h4>
              <p className="sp-leverage-desc">Make automation the centerpiece of all marketing and onboarding. Ensure the "aha!" moment happens within the first 5 minutes of usage.</p>
            </div>
            <div className="sp-leverage-card">
              <div className="sp-leverage-icon"><BsGraphUp size={18} /></div>
              <h4 className="sp-leverage-title">Use margin advantage for aggressive pricing</h4>
              <p className="sp-leverage-desc">Since your unit economics are strong, consider offering highly competitive entry pricing or freemium tiers to accelerate market capture against slower competitors.</p>
            </div>
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="sp-bottom-nav">
          <button className="sp-btn-ghost"><HiArrowLeft size={16} /> View Weaknesses</button>
          <button className="sp-btn-primary">View Opportunities <HiArrowRight size={16} /></button>
        </div>

      </div>
    </div>
  );
}
