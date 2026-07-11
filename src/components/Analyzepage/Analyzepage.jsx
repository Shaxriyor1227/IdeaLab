import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { RiSparklingLine } from "react-icons/ri";
import { MdAccessTime } from "react-icons/md";
import { auth, db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import "./Analyzepage.css";

const industries = [
  "Fintech", "Healthtech", "Edtech", "E-commerce", "SaaS",
  "AI / ML", "Logistics", "Real Estate", "Legal Tech", "Other",
];

const budgets = ["<$1k","$5k", "$5k-$10k", "$10k-$50k", "$50k-$200k", "$200k+"];

const buildPrompt = (form) => `
You are a startup idea validator. Analyze the following startup idea and return ONLY a valid JSON object. No markdown, no backticks, no explanation.

Startup name: ${form.startupName}
One-line description: ${form.oneLiner}
Problem: ${form.problem}
Target customer: ${form.targetCustomer}
Industry: ${form.industry}
Estimated budget: ${form.budget}

Return exactly this JSON structure:
{
  "viabilityScore": <number 0-100>,
  "viabilityLabel": "<High Potential | Moderate Potential | Needs Work>",
  "marketSize": "<e.g. $2.4B>",
  "marketGrowth": "<e.g. +12% YoY growth>",
  "competition": "<Low | Medium | High>",
  "competitorCount": <number>,
  "trendScore": "<e.g. 9.2/10>",
  "trendLabel": "<short trend description>",
  "competitors": [
    {
      "name": "<Real competitor company name>",
      "type": "<Product category e.g. SaaS Platform>",
      "founded": "<year>",
      "funding": "<e.g. $50M or Bootstrapped>",
      "desc": "<One sentence about what they do and their scale>",
      "logo": "<1-2 uppercase initials of company name>"
    },
    {
      "name": "<Real competitor company name>",
      "type": "<Product category>",
      "founded": "<year>",
      "funding": "<e.g. $50M or Bootstrapped>",
      "desc": "<One sentence about what they do and their scale>",
      "logo": "<1-2 uppercase initials>"
    },
    {
      "name": "<Real competitor company name>",
      "type": "<Product category>",
      "founded": "<year>",
      "funding": "<e.g. $50M or Bootstrapped>",
      "desc": "<One sentence about what they do and their scale>",
      "logo": "<1-2 uppercase initials>"
    }
  ],
  "swot": {
    "strengths": ["...", "...", "..."],
    "weaknesses": ["...", "...", "..."],
    "opportunities": ["...", "...", "..."],
    "threats": ["...", "...", "..."]
  },
  "recommendations": [
    { "title": "...", "description": "...", "priority": "High" },
    { "title": "...", "description": "...", "priority": "Medium" },
    { "title": "...", "description": "...", "priority": "Low" }
  ]
}
`;

export default function AnalyzePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("latestAnalysis");
    if (saved) {
      try {
        return JSON.parse(saved).formData;
      } catch {
        return {
          startupName: "",
          oneLiner: "",
          problem: "",
          targetCustomer: "",
          industry: "",
          budget: "",
        };
      }
    }
    return {
      startupName: "",
      oneLiner: "",
      problem: "",
      targetCustomer: "",
      industry: "",
      budget: "",
    };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.startupName || !form.problem) return;
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
          model: "laguna-m.1:free",
          // model: "nvidia/nemotron-3-super-120b-a12b:free",
          messages: [
            {
              role: "user",
              content: buildPrompt(form),
            },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "API error");
      }

      const text = data.choices[0].message.content;
      const clean = text.replace(/```json|```/g, "").trim();
      const result = JSON.parse(clean);

      const analysisData = {
        analysisId: Date.now().toString(),
        formData: form,
        result,
        analyzedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
      localStorage.setItem("latestAnalysis", JSON.stringify(analysisData));

      navigate("/results", { state: analysisData });
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  const isValid = form.startupName && form.problem;

  return (
    <div className="ap-page">
      <div className="ap-wrapper">
        <div className="ap-badge">
          <RiSparklingLine size={14} />
          {t("aiPoweredIntake")}
        </div>

        <h1 className="ap-title">{t("describeIdea")}</h1>
        <p className="ap-subtitle">{t("describeSub")}</p>

        <div className="ap-card">
          <div className="ap-row">
            <div className="ap-field">
              <label htmlFor="ap-startup-name" className="ap-label">{t("startupName")}</label>
              <input
                id="ap-startup-name"
                className="ap-input"
                name="startupName"
                placeholder="IdeaLab"
                value={form.startupName}
                onChange={handleChange}
              />
            </div>
            <div className="ap-field">
              <label htmlFor="ap-one-liner" className="ap-label">{t("oneLineDesc")}</label>
              <input
                id="ap-one-liner"
                className="ap-input"
                name="oneLiner"
                placeholder="AI CFO for freelance teams"
                value={form.oneLiner}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ap-field">
            <label htmlFor="ap-problem" className="ap-label">{t("problemSolving")}</label>
            <textarea
              id="ap-problem"
              className="ap-textarea"
              name="problem"
              placeholder={t("problemDesc")}
              value={form.problem}
              onChange={handleChange}
            />
          </div>

          <div className="ap-row">
            <div className="ap-field">
              <label htmlFor="ap-target-customer" className="ap-label">{t("targetCustomer")}</label>
              <input
                id="ap-target-customer"
                className="ap-input"
                name="targetCustomer"
                placeholder="Freelance agencies, solo founders..."
                value={form.targetCustomer}
                onChange={handleChange}
              />
            </div>
            <div className="ap-field">
              <label htmlFor="ap-industry" className="ap-label">{t("industryCategory")}</label>
              <select
                id="ap-industry"
                className="ap-select"
                name="industry"
                value={form.industry}
                onChange={handleChange}
              >
                <option value="">{t("selectIndustry")}</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="ap-field">
            <label htmlFor="ap-budget" className="ap-label">{t("estimatedBudget")}</label>
            <select
              id="ap-budget"
              className="ap-select"
              name="budget"
              value={form.budget}
              onChange={handleChange}
            >
              <option value="">{t("selectBudget")}</option>
              {budgets.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {error && <p className="ap-error">{error}</p>}

          <button
            className={`ap-btn ${(!isValid || loading) ? "ap-btn--disabled" : ""}`}
            onClick={handleSubmit}
            disabled={!isValid || loading}
          >
            {loading ? (
              <div className="ap-btn-loading">
                <span className="ap-spinner-icon" />
                <span className="ap-loading-text">{t("analyzingIdeas")}</span>
                <span className="ap-loading-dots">
                  <span>.</span><span>.</span><span>.</span>
                </span>
                <div className="ap-btn-scan-line"></div>
              </div>
            ) : (
              <> {t("btnAnalyze")} <HiArrowRight size={16} /></>
            )}
          </button>
        </div>

        <p className="ap-note">
          <MdAccessTime size={14} />
          {t("analysisTime")}
        </p>
      </div>
    </div>
  );
}