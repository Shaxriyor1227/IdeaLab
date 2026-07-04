import { RiTimeLine } from 'react-icons/ri';
import { HiArrowLeft } from 'react-icons/hi';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { blogPosts } from './blogData';
import './BlogPostPage.css';

export default function BlogPostPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  const postIndex = blogPosts.findIndex((item) => item.slug === slug);
  const post = blogPosts[postIndex];
  const nextPost = blogPosts[postIndex + 1] || null;

  if (!post) {
    return (
      <section className="blog-post-page">
        <button className="blog-back-btn" onClick={() => navigate(-1)}>
          <HiArrowLeft size={18} /> {t('backToBlog')}
        </button>
        <div className="blog-post-notfound">
          <h2>Article not found</h2>
          <p>The article you are looking for does not exist or may have been moved.</p>
        </div>
      </section>
    );
  }

  return (
    <article className="blog-post-page">
      <div className="blog-post-header-row">
        <button className="blog-back-btn" onClick={() => navigate(-1)}>
          <HiArrowLeft size={18} /> {t('backToBlog')}
        </button>
        <span className="blog-post-category">{post.category}</span>
      </div>
      <h1 className="blog-post-title">{post.title}</h1>
      <div className="blog-post-meta">
        <span>
          <RiTimeLine size={14} /> {post.date}
        </span>
        <span>•</span>
        <span>{post.readTime}</span>
      </div>
      <img src={post.image} alt={post.title} className="blog-post-image" />
      <div
        className="blog-post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {nextPost && (
        <div className="blog-post-next-card">
          <div className="blog-post-next-body">
            <p className="blog-post-next-label">{t('nextArticle')}</p>
            <h2 className="blog-post-next-title">{nextPost.title}</h2>
          </div>
          <div className="blog-post-next-action">
            <button
              className="blog-post-next-btn"
              onClick={() => navigate(`/blog/${nextPost.slug}`)}
            >
              {t('readNext')}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
