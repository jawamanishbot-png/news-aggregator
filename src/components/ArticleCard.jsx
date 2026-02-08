import './ArticleCard.css'

export default function ArticleCard({ article }) {
  const { title, description, image, url, source, publishedAt } = article

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <article className="article-card">
      {image && <img src={image} alt={title} className="article-image" onError={(e) => e.target.style.display = 'none'} />}
      <div className="article-content">
        <h2 className="article-title">{title}</h2>
        <p className="article-description">{description}</p>
        <div className="article-meta">
          <span className="source">{source}</span>
          <span className="date">{formatDate(publishedAt)}</span>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="read-more">
          Read More →
        </a>
      </div>
    </article>
  )
}
