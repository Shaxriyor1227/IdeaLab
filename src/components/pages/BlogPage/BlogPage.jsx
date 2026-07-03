import { RiArticleLine, RiTimeLine } from 'react-icons/ri';
import { HiArrowRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { blogPosts } from './blogData';
import './BlogPage.css';

export default function BlogPage() {
  const navigate = useNavigate();

  const handleReadArticle = (slug) => {
    navigate(`/blog/${slug}`);
  };

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

              <button
                className="blog-read-btn"
                onClick={() => handleReadArticle(post.slug)}
              >
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
            <input type="email" placeholder="your@email.com" className="blog-input" />
            <button className="blog-subscribe-btn">Subscribe</button>
          </div>
        </div>
      </div>
    </section>
  );
}