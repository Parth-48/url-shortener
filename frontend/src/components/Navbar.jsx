import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  return (
    <nav style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '52px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: '#111827', fontWeight: '600', fontSize: '35px' }}>
         Shortly
      </Link>
      <div style={{ display: 'flex', gap: '4px' }}>
        {[{ to: '/', label: 'Home' }, { to: '/dashboard', label: 'Dashboard' }].map(({ to, label }) => (
          <Link key={to} to={to} style={{
            padding: '5px 12px', borderRadius: '6px', fontSize: '23px', textDecoration: 'none',
            color: location.pathname === to ? '#111827' : '#6b7280',
            background: location.pathname === to ? '#f3f4f6' : 'transparent',
            fontWeight: location.pathname === to ? '500' : '400'
          }}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default Navbar