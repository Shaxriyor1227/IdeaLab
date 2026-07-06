import { RiArticleLine, RiTimeLine } from 'react-icons/ri';
import { HiArrowRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { blogPosts } from './blogData';
import './BlogPage.css';

export default function BlogPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleReadArticle = (slug) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <section className="blog-section">
      {/* Header */}
      <div className="blog-header">
        <span className="blog-eyebrow">
          <RiArticleLine size={14} /> {t('blog')}
        </span>
        <h1 className="blog-title">
          {t('blogTitleText')}
        </h1>
        <p className="blog-subtitle">
          {t('blogSubtitleText')}
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
                {t('readArticle')} <HiArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div className="blog-newsletter">
        <div className="blog-newsletter-content">
          <h2>{t('newsletterTitle')}</h2>
          <p>{t('newsletterSub')}</p>
          <div className="blog-newsletter-form">
            <input type="email" placeholder="your@email.com" className="blog-input" />
            <button className="blog-subscribe-btn">{t('subscribe')}</button>
          </div>
        </div>
      </div>
    </section>
  );
}