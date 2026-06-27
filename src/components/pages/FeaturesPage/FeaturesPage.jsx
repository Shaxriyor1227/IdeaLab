import { useNavigate } from "react-router-dom";
import { LuBrain, LuCircleGauge, LuChartNetwork, LuShieldCheck, LuFileDown } from "react-icons/lu";
import { RiSparklingLine, RiTimeLine } from "react-icons/ri";
import { MdCheckCircle } from "react-icons/md";
import { HiArrowRight } from "react-icons/hi";
import "./FeaturesPage.css";

const featureRows = [
  {
    icon: <LuBrain size={32} />,
    accent: "purple",
    label: "01 — SWOT Analysis",
    title: "Understand your startup from every angle",
    body: `Most founders are blind to their own weaknesses until it's too late. IdeaLab's AI dissects your idea across four critical dimensions — Strengths, Weaknesses, Opportunities, and Threats — all calibrated to your specific market, target customer, and competitive environment. This isn't a generic template. Every bullet point is generated fresh from your input, giving you a real-time mirror of where your idea truly stands. You'll walk away knowing exactly what to double down on and what needs fixing before you write a single line of code.`,
    points: [
      "Strengths tailored to your ICP and niche",
      "Weaknesses exposed before investors do",
      "Opportunities you may have never considered",
      "Threats ranked by urgency and impact",
    ],
    reverse: false,
  },
  {
    icon: <LuCircleGauge size={32} />,
    accent: "cyan",
    label: "02 — Viability Score",
    title: "One number that tells the whole story",
    body: `Investors use complex frameworks to evaluate ideas. Now you can too. IdeaLab distills market opportunity, urgency, monetization potential, competitive density, and trend momentum into a single Viability Score from 0 to 100. A score of 87 means your idea has strong fundamentals and clear market pull. A score of 42 means there's real work to do before you pitch. No ambiguity, no fluff — just a clear signal you can act on. Track how your score improves as you refine your hypothesis across multiple iterations.`,
    points: [
      "Score 0–100 with contextual labels",
      "Market size and growth rate included",
      "Trend momentum and timing analysis",
      "Compare scores across your idea history",
    ],
    reverse: true,
  },
  {
    icon: <LuChartNetwork size={32} />,
    accent: "violet",
    label: "03 — Competitor Intelligence",
    title: "See the battlefield before you enter it",
    body: `Entering a market without knowing your competitors is like driving blind at highway speed. IdeaLab maps the competitive landscape around your idea — identifying known players, spotting whitespace, surfacing potential substitutes, and highlighting where differentiation is possible. Instead of spending days on manual research, you get a structured intelligence report in under 60 seconds. Understand who you're up against, what they're missing, and how to position your product to win.`,
    points: [
      "Competitor count and category density",
      "Whitespace and gap identification",
      "Positioning angles that actually work",
      "Feature-by-feature comparison matrix",
    ],
    reverse: false,
  },
  {
    icon: <LuShieldCheck size={32} />,
    accent: "purple",
    label: "04 — AI Recommendations",
    title: "Not just analysis — a concrete action plan",
    body: `Analysis without action is just noise. After breaking down your idea, IdeaLab's AI generates a prioritized set of recommendations covering positioning strategy, MVP scope, pricing experiments, go-to-market channels, and early customer acquisition moves. Each recommendation is tagged as High, Medium, or Low priority so you always know where to start. Think of it as having a startup advisor on call — one who's reviewed thousands of business models and knows what actually works in today's market.`,
    points: [
      "High, Medium, Low priority tags",
      "Positioning and GTM channel advice",
      "MVP scope and feature sequencing",
      "Pricing experiment recommendations",
    ],
    reverse: true,
  },
  {
    icon: <RiTimeLine size={32} />,
    accent: "cyan",
    label: "05 — History & Tracking",
    title: "Watch your idea get sharper over time",
    body: `Great ideas rarely start perfect — they improve through iteration. IdeaLab saves every analysis you run, creating a personal validation history that lets you track your thinking over time. Go back to any previous analysis, compare viability scores across versions, and clearly see how your hypothesis evolves as you learn more about your market. Whether you're refining your positioning or pivoting entirely, your history is always there to guide the next move.`,
    points: [
      "Unlimited analysis history saved locally",
      "One-click access to any past report",
      "Score comparison across iterations",
      "Delete old analyses to keep things clean",
    ],
    reverse: false,
  },
  {
    icon: <LuFileDown size={32} />,
    accent: "violet",
    label: "06 — PDF Export",
    title: "Share your validation report anywhere",
    body: `Your analysis is only as valuable as your ability to communicate it. IdeaLab lets you export a clean, professional PDF report of your full validation — complete with viability scores, SWOT breakdown, market data, and AI recommendations. Share it with co-founders during planning sessions, present it to advisors for feedback, include it in investor decks, or use it to align your early team around a shared understanding of the opportunity. No formatting required — just one click.`,
    points: [
      "Full analysis in a clean single document",
      "Header-free, print-ready PDF layout",
      "Share with co-founders, advisors, or investors",
      "Export anytime directly from the results page",
    ],
    reverse: true,
  },
];

export default function FeaturesPage() {
  const navigate = useNavigate();

  return (
    <section className="fp-section">

      {/* Intro */}
      <div className="fp-intro">
        <span className="fp-eyebrow">
          <RiSparklingLine size={13} /> FEATURES
        </span>
        <h1 className="fp-main-title">
          Built for founders who{" "}
          <span className="fp-title-gradient">move fast</span>
          <br />and think clearly
        </h1>
        <p className="fp-main-subtitle">
          IdeaLab gives you a complete validation system in one place. From raw idea to
          investor-ready insight — powered by AI, designed for clarity, built for speed.
        </p>
        <div className="fp-intro-stats">
          <div className="fp-stat-pill"><strong>60s</strong><span>Full analysis</span></div>
          <div className="fp-stat-divider" />
          <div className="fp-stat-pill"><strong>6</strong><span>AI modules</span></div>
          <div className="fp-stat-divider" />
          <div className="fp-stat-pill"><strong>10K+</strong><span>Ideas validated</span></div>
          <div className="fp-stat-divider" />
          <div className="fp-stat-pill"><strong>4.9★</strong><span>User rating</span></div>
        </div>
      </div>

      {/* Feature Rows */}
      <div className="fp-rows">
        {featureRows.map((f, i) => (
          <div className={`fp-row ${f.reverse ? "fp-row--reverse" : ""}`} key={i}>
            {/* Visual Side */}
            <div className={`fp-visual fp-visual--${f.accent}`}>
              <div className={`fp-visual-icon fp-visual-icon--${f.accent}`}>{f.icon}</div>
              <ul className="fp-points-list">
                {f.points.map((p, j) => (
                  <li key={j}>
                    <MdCheckCircle className={`fp-check fp-check--${f.accent}`} size={16} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Text Side */}
            <div className="fp-text">
              <span className={`fp-label fp-label--${f.accent}`}>{f.label}</span>
              <h2 className="fp-row-title">{f.title}</h2>
              <p className="fp-row-body">{f.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="fp-cta">
        <span className="fp-cta-tag">Get Started Free</span>
        <h3 className="fp-cta-title">Stop guessing. Start validating.</h3>
        <p className="fp-cta-body">
          Every day you spend building without validation is a day you risk wasting. Run your
          first analysis in under 60 seconds and find out exactly where your idea stands.
        </p>
        <div className="fp-cta-actions">
          <button className="fp-cta-btn-primary" onClick={() => navigate("/analyze")}>
            Analyze My Idea <HiArrowRight size={16} />
          </button>
          <button className="fp-cta-btn-ghost" onClick={() => navigate("/history")}>
            View History
          </button>
        </div>
      </div>
    </section>
  );
}