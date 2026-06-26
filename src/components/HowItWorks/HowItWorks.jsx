import { FiSearch } from "react-icons/fi";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";
import "./HowItWorks.css";

const steps = [
  {
    icon: <FiSearch size={22} />,
    title: "Describe the idea",
    description:
      "Enter the target customer, problem, and initial product angle in plain language.",
  },
  {
    icon: <LuChartNoAxesCombined size={22} style={{color:"#06b6d4"}}/>,
    title: "AI scores the market",
    description:
      "The model grades urgency, competition, monetization, timing, and founder-market fit.",
  },
  {
    icon: <HiOutlineDocumentArrowDown size={22} />,
    title: "Export next steps",
    description:
      "Download a concise validation brief with risks, experiments, and recommended MVP scope.",
  },
];

export default function HowItWorks() {
  return (
    <section className="hiw-section">
      <p className="hiw-eyebrow">HOW IT WORKS</p>
      <h2 className="hiw-title">From startup idea to validation report</h2>
      <p className="hiw-subtitle">
        IdeaLab compresses research, scoring, and recommendations into a simple
        guided workflow for founders.
      </p>

      <div className="hiw-cards">
        {steps.map((step, i) => (
          <div className="hiw-card" key={i}>
            <div className="hiw-icon-wrap">{step.icon}</div>
            <h3 className="hiw-card-title">{step.title}</h3>
            <p className="hiw-card-desc">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}