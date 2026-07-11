import { useRef } from "react";
import { useTranslation } from "react-i18next";
import "./Testimonials.css";
import user1 from "../../assets/user1.svg";
import user2 from "../../assets/user2.svg";
import user3 from "../../assets/user3.svg";

export default function Testimonials() {
  const { t, i18n } = useTranslation();
  const trackRef = useRef(null);

  const testimonialsList = [
    {
      quote: t("testQuote1"),
      name: "Maya Chen",
      role: "Founder, LedgerNest",
      image: user1,
      stars: 5,
    },
    {
      quote: t("testQuote2"),
      name: "Jonas Weber",
      role: "Product Lead, Northstar AI",
      image: user2,
      stars: 5,
    },
    {
      quote: t("testQuote3"),
      name: "Iman Gadthy",
      role: "Studio Partner, LaunchRoom",
      image: user3,
      stars: 5,
    },
    {
      quote: i18n.language === "uz"
        ? "IdeaLab orqali startap g'oyamni tekshirib, xatolarimni vaqtida angladim. Ajoyib vosita!"
        : "Through IdeaLab, I tested my startup idea and caught my mistakes before they cost me.",
      name: "Alex Johnson",
      role: "CEO, TechVentures",
      image: user1,
      stars: 5,
    },
    {
      quote: i18n.language === "uz"
        ? "Raqobatchilarni tahlil qilish imkoniyati menga bozordagi haqiqiy holatni ko'rsatib berdi."
        : "The competitor analysis feature gave me a clear picture of the real market landscape.",
      name: "Sarah Lee",
      role: "Marketing Director",
      image: user2,
      stars: 4,
    },
    {
      quote: i18n.language === "uz"
        ? "Endi har qanday yangi loyihani boshlashdan oldin albatta IdeaLabdan foydalanaman."
        : "Now I always run every new project idea through IdeaLab before committing resources.",
      name: "David Smith",
      role: "Serial Entrepreneur",
      image: user3,
      stars: 5,
    },
  ];

  // Duplicate list for seamless infinite loop
  const duplicatedList = [...testimonialsList, ...testimonialsList];

  return (
    <section className="test-section">
      <p className="test-eyebrow">{t("testEyebrow")}</p>
      <h2 className="test-title">{t("testTitle")}</h2>
      <p className="test-subtitle">{t("testSubtitle")}</p>

      <div className="test-marquee">
        <div
          className="test-track"
          ref={trackRef}
          onMouseEnter={() => {
            if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
          }}
          onMouseLeave={() => {
            if (trackRef.current) trackRef.current.style.animationPlayState = "running";
          }}
        >
          {duplicatedList.map((item, i) => (
            <div className="test-card" key={`${item.name}-${i}`}>
              {/* Stars */}
              <div className="test-stars">
                {Array.from({ length: 5 }).map((_, si) => (
                  <span key={si} className={si < item.stars ? "test-star filled" : "test-star"}>
                    ★
                  </span>
                ))}
              </div>
              <p className="test-quote">"{item.quote}"</p>
              <div className="test-author">
                <img
                  className="test-avatar"
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  width="48"
                  height="48"
                />
                <div>
                  <p className="test-name">{item.name}</p>
                  <p className="test-role">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}