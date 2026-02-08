import { useState, useEffect } from 'react'
import axios from 'axios'
import NewsFeed from './components/NewsFeed'
import SearchBar from './components/SearchBar'
import CategoryFilter from './components/CategoryFilter'
import './App.css'

const API_KEY = import.meta.env.VITE_NEWS_API_KEY || ''

console.log('🔑 API Key Status:', {
  keyExists: !!API_KEY,
  keyLength: API_KEY?.length || 0,
  keyStart: API_KEY?.substring(0, 5) + '...' || 'MISSING',
})

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

    if (!API_KEY) {
      console.error('❌ API_KEY is missing!')
      setError('Please add VITE_NEWS_API_KEY to environment variables')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const endpoint = query
        ? `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}&sortBy=${sortBy}`
        : `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${API_KEY}&sortBy=${sortBy}`

      console.log('🚀 Making API request to:', endpoint.split('apiKey=')[0] + 'apiKey=***')
      const response = await axios.get(endpoint)
      console.log('✅ API Success:', { articlesCount: response.data.articles?.length || 0 })
      setArticles(response.data.articles || [])
    } catch (err) {
      console.error('❌ API Error:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
      })
      setError(`Failed to fetch news: ${err.response?.data?.message || err.message}`)
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
