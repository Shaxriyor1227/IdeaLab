import { FiSearch } from "react-icons/fi";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";
import { useLanguage } from "../context/LanguageContext";
import "./HowItWorks.css";

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: <FiSearch size={22} />,
      title: t("hiwDescribeTitle"),
      description: t("hiwDescribeDesc"),
    },
    {
      icon: <LuChartNoAxesCombined size={22} style={{color:"#06b6d4"}}/>,
      title: t("hiwAiTitle"),
      description: t("hiwAiDesc"),
    },
    {
      icon: <HiOutlineDocumentArrowDown size={22} />,
      title: t("hiwExportTitle"),
      description: t("hiwExportDesc"),
    },
  ];

  return (
    <section className="hiw-section">
      <p className="hiw-eyebrow">{t("hiwEyebrow")}</p>
      <h2 className="hiw-title">{t("hiwMainTitle")}</h2>
      <p className="hiw-subtitle">{t("hiwSubtitle")}</p>

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