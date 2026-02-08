import axios from 'axios'

const API_KEY = process.env.NEWS_API_KEY

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  console.log('🚀 API Handler called')
  console.log('📋 Method:', req.method)
  console.log('🔑 API_KEY exists?', !!API_KEY)
  console.log('📝 Query params:', req.query)

  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS request, returning 200')
    res.status(200).end()
    return
  }

  if (!API_KEY) {
    console.error('❌ API_KEY is missing!')
    return res.status(500).json({ error: 'API_KEY not configured on server' })
  }

  const { query, category, sortBy } = req.query

  try {
    const endpoint = query
      ? `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}&sortBy=${sortBy}`
      : `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${API_KEY}&sortBy=${sortBy}`

    console.log('📡 Fetching from NewsAPI:', endpoint.split('apiKey=')[0] + 'apiKey=***')
    console.log('🔗 Full URL (masked):', endpoint.replace(API_KEY, '***'))

    const response = await axios.get(endpoint)

    console.log('✅ Success! Articles count:', response.data.articles?.length || 0)

    return res.status(200).json({
      articles: response.data.articles || [],
      totalResults: response.data.totalResults || 0,
    })
  } catch (error) {
    console.error('❌ NewsAPI Error:')
    console.error('  Status:', error.response?.status)
    console.error('  Data:', error.response?.data)
    console.error('  Message:', error.message)
    return res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message,
    })
  }
}
