import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { RiSparklingLine } from "react-icons/ri";
import { MdAccessTime } from "react-icons/md";
import "./AnalyzePage.css";

const industries = [
  "Fintech", "Healthtech", "Edtech", "E-commerce", "SaaS",
  "AI / ML", "Logistics", "Real Estate", "Legal Tech", "Other",
];

const budgets = ["<$10k", "$10k-$50k", "$50k-$200k", "$200k+"];

const PROMPT = (form) => `
You are a startup idea validator. Analyze the following startup idea and return ONLY a valid JSON object with no extra text, no markdown, no backticks.

Startup name: ${form.startupName}
One-line description: ${form.oneLiner}
Problem: ${form.problem}
Target customer: ${form.targetCustomer}
Industry: ${form.industry}
Estimated budget: ${form.budget}

Return this exact JSON structure:
{
  "viabilityScore": <number 0-100>,
  "viabilityLabel": "<High Potential | Moderate Potential | Needs Work>",
  "marketSize": "<e.g. $2.4B>",
  "marketGrowth": "<e.g. +12% YoY growth>",
  "competition": "<Low | Medium | High>",
  "competitorCount": <number>,
  "trendScore": "<e.g. 9.2/10>",
  "trendLabel": "<short trend description>",
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
  const [form, setForm] = useState({
    startupName: "",
    oneLiner: "",
    problem: "",
    targetCustomer: "",
    industry: "",
    budget: "",
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
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: PROMPT(form) }],
        }),
      });

      const data = await response.json();
      const text = data.content.map((i) => i.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const result = JSON.parse(clean);

      navigate("/results", {
        state: { formData: form, result, analyzedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
      });
    } catch (err) {
      setError("Analysis failed. Please try again.");
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
          AI-powered idea intake
        </div>

        <h1 className="ap-title">Describe Your Startup Idea</h1>
        <p className="ap-subtitle">
          Give IdeaLab the core details and we'll prepare your concept for a
          fast AI validation pass.
        </p>

        <div className="ap-card">
          <div className="ap-row">
            <div className="ap-field">
              <label className="ap-label">Startup name</label>
              <input className="ap-input" name="startupName" placeholder="IdeaLab" value={form.startupName} onChange={handleChange} />
            </div>
            <div className="ap-field">
              <label className="ap-label">One-line description</label>
              <input className="ap-input" name="oneLiner" placeholder="AI CFO for freelance teams" value={form.oneLiner} onChange={handleChange} />
            </div>
          </div>

          <div className="ap-field">
            <label className="ap-label">Problem you're solving</label>
            <textarea className="ap-textarea" name="problem" placeholder="Describe the painful workflow, customer frustration, or market gap..." value={form.problem} onChange={handleChange} />
          </div>

          <div className="ap-row">
            <div className="ap-field">
              <label className="ap-label">Target customer</label>
              <input className="ap-input" name="targetCustomer" placeholder="Freelance agencies, solo founders..." value={form.targetCustomer} onChange={handleChange} />
            </div>
            <div className="ap-field">
              <label className="ap-label">Industry category</label>
              <select className="ap-select" name="industry" value={form.industry} onChange={handleChange}>
                <option value="">Select industry</option>
                {industries.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
          </div>

          <div className="ap-field">
            <label className="ap-label">Estimated budget</label>
            <select className="ap-select" name="budget" value={form.budget} onChange={handleChange}>
              <option value="">Select budget</option>
              {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {error && <p className="ap-error">{error}</p>}

          <button className={`ap-btn ${(!isValid || loading) ? "ap-btn--disabled" : ""}`} onClick={handleSubmit} disabled={!isValid || loading}>
            {loading ? (
              <><span className="ap-spinner" /> Analyzing...</>
            ) : (
              <>Analyze My Idea <HiArrowRight size={16} /></>
            )}
          </button>
        </div>

        <p className="ap-note">
          <MdAccessTime size={14} />
          Analysis takes ~60 seconds
        </p>
      </div>
    </div>
  );
}