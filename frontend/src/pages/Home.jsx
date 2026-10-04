import { useState } from 'react'
import { shortenURL } from '../api'

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  card: { width: '100%', maxWidth: '560px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  heading: { fontSize: '26px', fontWeight: '600', color: '#111827', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '10px' },
  subtext: { fontSize: '15px', color: '#6b7280', margin: '0 0 28px' },
  input: { width: '100%', boxSizing: 'border-box', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '13px 16px', fontSize: '15px', color: '#111827', outline: 'none', marginBottom: '10px', background: '#fff' },
  button: { width: '100%', background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '13px 16px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' },
  buttonDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  error: { marginTop: '14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 14px', fontSize: '14px', color: '#dc2626' },
  result: { marginTop: '14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px' },
  resultLabel: { fontSize: '12px', color: '#6b7280', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  resultRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' },
  resultLink: { fontSize: '15px', fontWeight: '600', color: '#2563eb', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  copyBtn: { background: '#fff', border: '1px solid #d1d5db', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', color: '#374151', cursor: 'pointer', whiteSpace: 'nowrap' },
  originalUrl: { fontSize: '13px', color: '#9ca3af', margin: '10px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
}

function Home() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleShorten = async () => {
    if (!url.trim()) { setError('Please enter a URL'); return }
    if (!url.startsWith('http')) { setError('URL must start with http:// or https://'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const response = await shortenURL(url)
      setResult(response.data)
    } catch (err) {
      if (err.response?.status === 429) setError('Rate limit exceeded. Please wait a minute.')
      else setError('Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result.short_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}> Shortly</h1>
        <p style={styles.subtext}>Paste a link, get a short one.</p>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
          placeholder="https://your-long-url-here.com/..."
          style={styles.input}
        />

        <button
          onClick={handleShorten}
          disabled={loading}
          style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
        >
          {loading ? 'Shortening...' : 'Shorten →'}
        </button>

        {error && <div style={styles.error}>⚠ {error}</div>}

        {result && (
          <div style={styles.result}>
            <p style={styles.resultLabel}>Short URL</p>
            <div style={styles.resultRow}>
              <a href={result.short_url} target="_blank" rel="noopener noreferrer" style={styles.resultLink}>
                {result.short_url}
              </a>
              <button onClick={handleCopy} style={styles.copyBtn}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <p style={styles.originalUrl}>↳ {result.original_url}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home