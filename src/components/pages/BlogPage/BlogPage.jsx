import { RiArticleLine, RiCalendarEventLine, RiTimeLine } from 'react-icons/ri';
import { HiArrowRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import './BlogPage.css';

const blogPosts = [
  {
    id: 1,
    title: "Why 90% of Startups Fail (And How to Be the 10%)",
    category: "Startup Strategy",
    date: "Oct 12, 2023",
    readTime: "5 min read",
    excerpt: "Most startups don't fail because they couldn't build the product. They fail because they built a product nobody wanted. Here is how to avoid the builder's trap.",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "The MVP is Dead: Why You Need to Validate Before You Build",
    category: "Product Management",
    date: "Sep 28, 2023",
    readTime: "7 min read",
    excerpt: "Building a Minimum Viable Product used to be the gold standard. Today, even an MVP is too expensive if you haven't validated the core premise.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "How to Analyze Your Competitors Without Getting Distracted",
    category: "Market Research",
    date: "Sep 15, 2023",
    readTime: "6 min read",
    excerpt: "Competitor obsession can kill your unique value proposition. Learn the framework to extract competitor insights while staying focused on your own customers.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "Pricing Psychology: How to Charge What You're Actually Worth",
    category: "Growth & Sales",
    date: "Aug 30, 2023",
    readTime: "8 min read",
    excerpt: "Pricing isn't a math problem—it's a psychological one. Discover the exact frameworks successful SaaS founders use to position their pricing.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    title: "Finding Your First 100 Paying Customers",
    category: "Marketing",
    date: "Aug 14, 2023",
    readTime: "6 min read",
    excerpt: "Zero to one is the hardest phase of any business. We breakdown the unscalable tactics that actually work for acquiring your initial user base.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    title: "When to Pivot and When to Persevere",
    category: "Founder Psychology",
    date: "Jul 22, 2023",
    readTime: "4 min read",
    excerpt: "The hardest decision a founder has to make. We analyze data from 500 successful pivots to find the signals that indicate it's time to change direction.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800"
  }
];

export default function BlogPage() {
  const navigate = useNavigate();

  return (
    <section className="blog-section">
      {/* Header */}
      <div className="blog-header">
        <span className="blog-eyebrow">
          <RiArticleLine size={14} /> RESOURCES & INSIGHTS
        </span>
        <h1 className="blog-title">
          Learn how to build <span className="blog-title-gradient">smarter</span>
        </h1>
        <p className="blog-subtitle">
          Expert insights on startup validation, product strategy, market research, and growth.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="blog-grid">
        {blogPosts.map((post) => (
          <div className="blog-card" key={post.id}>
            <div className="blog-card-image">
              <img src={post.image} alt={post.title} />
              <div className="blog-card-category">{post.category}</div>
            </div>
            <div className="blog-card-content">
              <div className="blog-card-meta">
                <span className="blog-meta-item">
                  <RiTimeLine size={14} /> {post.date}
                </span>
                <span className="blog-meta-dot">•</span>
                <span className="blog-meta-item">{post.readTime}</span>
              </div>
              <h3 className="blog-card-title">{post.title}</h3>
              <p className="blog-card-excerpt">{post.excerpt}</p>
              <button className="blog-read-btn">
                Read Article <HiArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div className="blog-newsletter">
        <div className="blog-newsletter-content">
          <h2>Get startup insights delivered to your inbox</h2>
          <p>Join 10,000+ founders who get our weekly newsletter on product validation.</p>
          <div className="blog-newsletter-form">
            <input type="email" placeholder="you@example.com" className="blog-input" />
            <button className="blog-subscribe-btn">Subscribe</button>
          </div>
        </div>
      </div>
    </section>
  );
}
