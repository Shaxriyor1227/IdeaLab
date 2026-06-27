import "./Testimonials.css";
import user1 from "../../assets/user1.png";
import user2 from "../../assets/user2.png";
import user3 from "../../assets/user3.png";

const testimonials = [
  {
    quote:
      "IdeaLab helped us kill two weak concepts and double down on the one customers were already trying to hack together.",
    name: "Maya Chen",
    role: "Founder, LedgerNest",
    image: user1,
    gradient: "linear-gradient(135deg, #6d28d9, #4f46e5)",
  },
  {
    quote:
      "The competitor map alone saved a week of research. It gave us a clearer wedge and better investor answers.",
    name: "Jonas Weber",
    role: "Product Lead, Northstar AI",
    image: user2,
    gradient: "linear-gradient(135deg, #0ea5e9, #6d28d9)",
  },
  {
    quote:
      "It turns founder excitement into evidence. We now run every new product bet through IdeaLab before committing design time.",
    name: "Priya Raman",
    role: "Studio Partner, LaunchRoom",
    image: user3,
    gradient: "linear-gradient(135deg, #6d28d9, #0ea5e9)",
  },
];

export default function Testimonials() {
  return (
    <section className="test-section">
      <p className="test-eyebrow">LOVED BY OPERATORS</p>
      <h2 className="test-title">Sharper decisions before launch</h2>
      <p className="test-subtitle">
        Founders use IdeaLab to avoid expensive false starts and focus on the
        ideas with real signal.
      </p>

      <div className="test-grid">
        {testimonials.map((t, i) => (
          <div className="test-card" key={i}>
            <p className="test-quote">"{t.quote}"</p>
            <div className="test-author">
              <img
                className="test-avatar"
                src={t.image}
                alt={t.name}
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