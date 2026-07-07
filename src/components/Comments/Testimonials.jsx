import { useTranslation } from "react-i18next";
import "./Testimonials.css";
import user1 from "../../assets/user1.svg";
import user2 from "../../assets/user2.svg";
import user3 from "../../assets/user3.svg";

export default function Testimonials() {
  const { t } = useTranslation();

  const testimonialsList = [
    {
      quote: t("testQuote1"),
      name: "Maya Chen",
      role: "Founder, LedgerNest",
      image: user1,
      gradient: "linear-gradient(135deg, #6d28d9, #4f46e5)",
    },
    {
      quote: t("testQuote2"),
      name: "Jonas Weber",
      role: "Product Lead, Northstar AI",
      image: user2,
      gradient: "linear-gradient(135deg, #0ea5e9, #6d28d9)",
    },
    {
      quote: t("testQuote3"),
      name: "Iman Gadthy",
      role: "Studio Partner, LaunchRoom",
      image: user3,
      gradient: "linear-gradient(135deg, #6d28d9, #0ea5e9)",
    },
  ];

  return (
    <section className="test-section">
      <p className="test-eyebrow">{t("testEyebrow")}</p>
      <h2 className="test-title">{t("testTitle")}</h2>
      <p className="test-subtitle">{t("testSubtitle")}</p>

      <div className="test-grid">
        {testimonialsList.map((t) => (
          <div className="test-card" key={t.name}>
            <p className="test-quote">"{t.quote}"</p>
            <div className="test-author">
              <img
                className="test-avatar"
                src={t.image}
                alt={t.name}
                loading="lazy"
                decoding="async"
                width="48"
                height="48"
              />
              <div>
                <p className="test-name">{t.name}</p>
                <p className="test-role">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}