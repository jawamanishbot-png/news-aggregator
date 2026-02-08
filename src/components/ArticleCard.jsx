import './ArticleCard.css'

export default function ArticleCard({ article }) {
  // NewsAPI returns urlToImage, not image
  // and source as object { id, name }
  const { title, description, urlToImage, url, source, publishedAt } = article
  const sourceName = typeof source === 'string' ? source : source?.name

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <article className="article-card">
      {urlToImage && <img src={urlToImage} alt={title} className="article-image" onError={(e) => e.target.style.display = 'none'} />}
      <div className="article-content">
        <h2 className="article-title">{title}</h2>
        <p className="article-description">{description}</p>
        <div className="article-meta">
          <span className="source">{sourceName || 'Unknown'}</span>
          <span className="date">{formatDate(publishedAt)}</span>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="read-more">
          Read More →
        </a>
      </div>
    </article>
  )
}
