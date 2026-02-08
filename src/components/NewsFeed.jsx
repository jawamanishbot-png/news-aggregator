import ArticleCard from './ArticleCard'
import './NewsFeed.css'

export default function NewsFeed({ articles }) {
  if (articles.length === 0) {
    return <div className="no-articles">No articles found</div>
  }

  return (
    <div className="news-feed">
      {articles.map((article, index) => (
        <ArticleCard key={`${article.url}-${index}`} article={article} />
      ))}
    </div>
  )
}
