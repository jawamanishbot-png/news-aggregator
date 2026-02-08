import { useState } from 'react'
import './DebugPanel.css'

export default function DebugPanel({ error, articles, loading }) {
  const [showDebug, setShowDebug] = useState(false)

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
            <h3>Debug Info</h3>
            <button onClick={() => setShowDebug(false)}>✕</button>
          </div>

          <div className="debug-content">
            <div className="debug-section">
              <h4>Status</h4>
              <p>Loading: {loading ? '✅ Yes' : '❌ No'}</p>
              <p>Articles found: {articles.length}</p>
              <p>API URL: {window.location.origin}/api/news</p>
            </div>

            {error && (
              <div className="debug-section error">
                <h4>Error</h4>
                <p>{error}</p>
              </div>
            )}

            <div className="debug-section">
              <h4>Console Logs</h4>
              <p>Check browser DevTools (F12) → Console tab for detailed logs</p>
              <button onClick={() => console.log({ error, articles, loading })}>
                Log Current State
              </button>
            </div>

            <div className="debug-section">
              <h4>Quick Test</h4>
              <button onClick={() => testAPI()}>Test API Endpoint</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function testAPI() {
  console.log('🧪 Testing API endpoint...')
  fetch('/api/news?category=technology&sortBy=publishedAt')
    .then((res) => res.json())
    .then((data) => console.log('✅ API Response:', data))
    .catch((err) => console.error('❌ API Error:', err))
}
