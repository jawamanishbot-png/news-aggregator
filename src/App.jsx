import { useState, useEffect } from 'react'
import axios from 'axios'
import NewsFeed from './components/NewsFeed'
import SearchBar from './components/SearchBar'
import CategoryFilter from './components/CategoryFilter'
import DebugPanel from './components/DebugPanel'
import './App.css'

// API key is now server-side only (in backend API route)
console.log('✅ App initialized - API calls will go through backend proxy')

export default function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('technology')
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [sortBy, setSortBy] = useState('publishedAt')

  const CATEGORIES = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology']

  const fetchNews = async (query = searchQuery, category = selectedCategory) => {
    console.log('📡 fetchNews called:', { query, category, sortBy })

    setLoading(true)
    setError(null)

    try {
      // Call our backend API endpoint (which calls NewsAPI)
      const apiUrl = '/api/news'
      const params = new URLSearchParams({
        ...(query ? { query } : { category }),
        sortBy,
      })

      console.log('🚀 Making request to backend:', `${apiUrl}?${params}`)
      const response = await axios.get(`${apiUrl}?${params}`)
      console.log('✅ API Success:', { articlesCount: response.data.articles?.length || 0 })
      setArticles(response.data.articles || [])
    } catch (err) {
      console.error('❌ API Error:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
      })
      setError(`Failed to fetch news: ${err.response?.data?.error || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Don't fetch on load - let user manually trigger search
    console.log('✅ App initialized - ready for search')
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

      <DebugPanel error={error} articles={articles} loading={loading} />
    </div>
  )
}
