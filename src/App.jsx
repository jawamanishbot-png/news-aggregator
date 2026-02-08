import { useState, useEffect } from 'react'
import axios from 'axios'
import NewsFeed from './components/NewsFeed'
import SearchBar from './components/SearchBar'
import CategoryFilter from './components/CategoryFilter'
import './App.css'

const API_KEY = import.meta.env.VITE_NEWS_API_KEY || ''

export default function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('technology')
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [sortBy, setSortBy] = useState('publishedAt')

  const CATEGORIES = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology']

  const fetchNews = async (query = searchQuery, category = selectedCategory) => {
    if (!API_KEY) {
      setError('Please add VITE_NEWS_API_KEY to .env file')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const endpoint = query
        ? `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}&sortBy=${sortBy}`
        : `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${API_KEY}&sortBy=${sortBy}`

      const response = await axios.get(endpoint)
      setArticles(response.data.articles || [])
    } catch (err) {
      setError('Failed to fetch news. Check API key or try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const handleSearch = (query) => {
    setSearchQuery(query)
    fetchNews(query, selectedCategory)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setSearchQuery('')
    fetchNews('', category)
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    fetchNews(searchQuery, selectedCategory)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📰 News Aggregator</h1>
        <p>Stay updated with the latest news</p>
      </header>

      <div className="controls">
        <SearchBar onSearch={handleSearch} />
        <CategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        <div className="sort-controls">
          <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
            <option value="publishedAt">Latest</option>
            <option value="relevancy">Relevance</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Loading news...</div>}

      <NewsFeed articles={articles} />
    </div>
  )
}
