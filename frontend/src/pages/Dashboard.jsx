import { useState, useEffect } from 'react'
import { getAllURLs } from '../api'

const s = {
  page: { minHeight: '100vh', background: '#f8f9fa', padding: '2rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  inner: { maxWidth: '900px', margin: '0 auto' },
  heading: { fontSize: '20px', fontWeight: '600', color: '#111827', margin: '0 0 4px' },
  sub: { fontSize: '14px', color: '#6b7280', margin: '0 0 24px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' },
  statCard: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px' },
  statLabel: { fontSize: '12px', color: '#6b7280', margin: '0 0 6px' },
  statValue: { fontSize: '22px', fontWeight: '600', color: '#111827', margin: 0 },
  tableWrap: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
  thCenter: { padding: '10px 16px', textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
  td: { padding: '12px 16px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f3f4f6' },
  tdCenter: { padding: '12px 16px', fontSize: '13px', color: '#374151', borderBottom: '1px solid #f3f4f6', textAlign: 'center' },
  badge: { background: '#eff6ff', color: '#2563eb', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '6px' },
  mono: { fontFamily: 'ui-monospace, monospace', fontSize: '13px', color: '#2563eb', fontWeight: '600', textDecoration: 'none' },
  empty: { textAlign: 'center', padding: '4rem 0', color: '#9ca3af', fontSize: '14px' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '20px' },
  pageBtn: { fontSize: '13px', color: '#374151', padding: '6px 12px' },
  pageInfo: { fontSize: '13px', color: '#6b7280' },
}

function Dashboard() {
  const [urls, setUrls] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const limit = 10

  useEffect(() => { fetchURLs() }, [page])

  const fetchURLs = async () => {
    setLoading(true)
    try {
      const res = await getAllURLs(page * limit, limit)
      setUrls(res.data.urls)
      setTotal(res.data.total)
    } catch { setError('Failed to load URLs') }
    finally { setLoading(false) }
  }

  const totalClicks = urls.reduce((sum, u) => sum + u.click_count, 0)
  const topLink = urls.reduce((top, u) => (!top || u.click_count > top.click_count) ? u : top, null)
  const totalPages = Math.ceil(total / limit)
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'
  const trunc = (s, n) => s?.length > n ? s.slice(0, n) + '...' : s

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <h1 style={s.heading}>Your links</h1>
        <p style={s.sub}>{total} URL{total !== 1 ? 's' : ''} shortened</p>

        {/* Stat Cards */}
        <div style={s.statsGrid}>
          <div style={s.statCard}>
            <p style={s.statLabel}>Total links</p>
            <p style={s.statValue}>{total}</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statLabel}>Total clicks</p>
            <p style={s.statValue}>{totalClicks}</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statLabel}>Top link</p>
            <p style={{ ...s.statValue, fontSize: '16px', fontFamily: 'ui-monospace, monospace', color: '#2563eb' }}>
              {topLink?.short_code || '—'}
            </p>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={s.empty}>Loading...</div>
        ) : urls.length === 0 ? (
          <div style={s.empty}>No links yet. Go shorten something.</div>
        ) : (
          <div style={s.tableWrap}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={s.th}>Short code</th>
                  <th style={s.th}>Original URL</th>
                  <th style={s.thCenter}>Clicks</th>
                  <th style={s.thCenter}>Created</th>
                  <th style={s.thCenter}>Last clicked</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url) => (
                  <tr key={url.short_code}>
                    <td style={s.td}>
                      <a href={url.short_url} target="_blank" rel="noopener noreferrer" style={s.mono}>
                        {url.short_code}
                      </a>
                    </td>
                    <td style={{ ...s.td, color: '#6b7280', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a href={url.original_url} target="_blank" rel="noopener noreferrer"
                        style={{ color: '#6b7280', textDecoration: 'none' }} title={url.original_url}>
                        {trunc(url.original_url, 45)}
                      </a>
                    </td>
                    <td style={s.tdCenter}>
                      <span style={s.badge}>{url.click_count}</span>
                    </td>
                    <td style={{ ...s.tdCenter, color: '#9ca3af' }}>{fmt(url.created_at)}</td>
                    <td style={{ ...s.tdCenter, color: '#9ca3af' }}>{fmt(url.last_clicked)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div style={s.pagination}>
            <button onClick={() => setPage(p => p - 1)} disabled={page === 0} style={s.pageBtn}>← Prev</button>
            <span style={s.pageInfo}>Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page + 1 >= totalPages} style={s.pageBtn}>Next →</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard