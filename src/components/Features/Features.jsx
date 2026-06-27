import { MdOutlineAutoAwesome } from "react-icons/md";
import { RiBarChartBoxLine, RiTimeLine, RiFileChartLine } from "react-icons/ri";
import { TbTargetArrow, TbBulb } from "react-icons/tb";
import { LuBrain } from "react-icons/lu";
import { LuCircleGauge } from "react-icons/lu";
import { LuChartNetwork } from "react-icons/lu";
import { LuFileClock } from "react-icons/lu";
import { LuFileDown } from "react-icons/lu";





import "./Features.css";

const features = [
  {
    icon:<LuBrain size={22}/>,
    title: "SWOT Analysis",
    description:
      "Instant strengths, weaknesses, opportunities, and threats tailored to your market and ICP.",
    accent: "purple",
  },
  {
    icon: <LuCircleGauge size={22}/>,
    title: "Market Score",
    description:
      "Grade opportunity size, urgency, monetization, and timing with a single benchmark score.",
    accent: "teal",
  },
  {
    icon: <LuChartNetwork size={22}/>,
    title: "Competitor Map",
    description:
      "Spot crowded categories, whitespace, substitutes, and differentiation opportunities fast.",
    accent: "violet",
  },
  {
    icon: <LuFileClock size={22}/>,
    title: "AI Recommendations",
    description:
      "Get concrete positioning, experiment, pricing, and MVP recommendations for the next sprint.",
    accent: "teal",
  },
  {
    icon: <RiTimeLine size={22} />,
    title: "History Dashboard",
    description:
      "Track idea iterations, compare scores, and learn which assumptions improve over time.",
    accent: "purple",
  },
  {
    icon: <LuFileDown size={22}/>,
    title: "PDF Export",
    description:
      "Share polished validation reports with cofounders, advisors, investors, or early customers.",
    accent: "violet",
  },
];

export default function Features() {
  return (
    <section className="feat-section">
      <p className="feat-eyebrow">FEATURES</p>
      <h2 className="feat-title">
        Everything founders need <br /> before the first sprint
      </h2>
      <p className="feat-subtitle">
        Replace guesswork with a repeatable validation system built for speed,
        clarity, and credible next steps.
      </p>

      <div className="feat-grid">
        {features.map((f, i) => (
          <div className={`feat-card feat-card--${f.accent}`} key={i}>
            <div className={`feat-icon feat-icon--${f.accent}`}>{f.icon}</div>
            <h3 className="feat-card-title">{f.title}</h3>
            <p className="feat-card-desc">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}