import { useState } from 'react'
import './DebugPanel.css'

export default function DebugPanel({ error, articles, loading }) {
  const [showDebug, setShowDebug] = useState(true)
  const [apiResponse, setApiResponse] = useState(null)
  const [testLoading, setTestLoading] = useState(false)

  const testAPI = async () => {
    setTestLoading(true)
    try {
      const res = await fetch('/api/news?category=technology&sortBy=publishedAt')
      const data = await res.json()
      setApiResponse(data)
      console.log('✅ API Response:', data)
    } catch (err) {
      setApiResponse({ error: err.message })
      console.error('❌ API Error:', err)
    } finally {
      setTestLoading(false)
    }
  }

  return (
    <>
      <button
        className="debug-button"
        onClick={() => setShowDebug(!showDebug)}
        title="Toggle debug panel"
      >
        🐛
      </button>

      {showDebug && (
        <div className="debug-panel">
          <div className="debug-header">
            <h3>🐛 Debug Panel (Mobile)</h3>
            <button onClick={() => setShowDebug(false)}>✕</button>
          </div>

          <div className="debug-content">
            <div className="debug-section">
              <h4>📊 Current State</h4>
              <p><strong>Loading:</strong> {loading ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Articles loaded:</strong> {articles.length}</p>
              <p><strong>Has error:</strong> {error ? '⚠️ Yes' : '✅ No'}</p>
            </div>

            {error && (
              <div className="debug-section error">
                <h4>❌ Error Message</h4>
                <p style={{ wordBreak: 'break-word', fontSize: '0.9rem' }}>{error}</p>
              </div>
            )}

            {articles.length > 0 && (
              <div className="debug-section">
                <h4>📰 First Article</h4>
                <p><strong>Title:</strong> {articles[0].title}</p>
                <p><strong>Source:</strong> {articles[0].source?.name}</p>
              </div>
            )}

            <div className="debug-section">
              <h4>🧪 Test API</h4>
              <button 
                onClick={testAPI}
                disabled={testLoading}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              >
                {testLoading ? '⏳ Testing...' : '▶️ Test API Call'}
              </button>
              {apiResponse && (
                <div style={{ fontSize: '0.85rem', background: '#f0f0f0', padding: '10px', borderRadius: '4px', maxHeight: '200px', overflow: 'auto' }}>
                  <strong>Response:</strong>
                  <pre style={{ margin: '5px 0', fontSize: '0.8rem' }}>
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="debug-section">
              <h4>ℹ️ Info</h4>
              <p><strong>API URL:</strong> {window.location.origin}/api/news</p>
              <p><strong>User Agent:</strong> {navigator.userAgent.split('(')[1]?.split(';')[0] || 'Unknown'}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
