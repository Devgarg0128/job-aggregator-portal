import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.left}>
          <Link to="/" style={styles.logoLink}>
            <div style={styles.logoContainer}>
              <div style={styles.logoIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <span style={styles.logoText}>JobRadar</span>
            </div>
          </Link>
          <div style={styles.tagline}>
            <span style={styles.dot}></span>
            <span style={styles.taglineText}>Updated daily</span>
          </div>
        </div>

        <div style={styles.right}>
          {user ? (
            <>
              <div style={styles.navLinks}>
                <Link 
                  to="/" 
                  style={{
                    ...styles.navLink,
                    ...(isActive('/') ? styles.navLinkActive : {})
                  }}
                >
                  Browse
                </Link>
                <Link 
                  to="/saved" 
                  style={{
                    ...styles.navLink,
                    ...(isActive('/saved') ? styles.navLinkActive : {})
                  }}
                >
                  Saved
                </Link>
                <Link 
                  to="/dashboard" 
                  style={{
                    ...styles.navLink,
                    ...(isActive('/dashboard') ? styles.navLinkActive : {})
                  }}
                >
                  Tracker
                </Link>
              </div>
              
              <div style={styles.divider}></div>
              
              <div style={styles.userSection}>
                <div style={styles.avatar}>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span style={styles.userName}>{user.name}</span>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div style={styles.authButtons}>
              <Link to="/login" style={styles.loginBtn}>Sign in</Link>
              <Link to="/register" style={styles.registerBtn}>Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#0a0a0a',
    borderBottom: '1px solid #262626',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(12px)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logoLink: {
    textDecoration: 'none',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#fafafa',
    letterSpacing: '-0.02em',
  },
  tagline: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: '#171717',
    borderRadius: '20px',
    border: '1px solid #262626',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
  },
  taglineText: {
    fontSize: '12px',
    color: '#a1a1a1',
    fontWeight: '500',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  navLink: {
    color: '#a1a1a1',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    padding: '8px 14px',
    borderRadius: '6px',
    transition: 'all 150ms ease',
  },
  navLinkActive: {
    color: '#fafafa',
    backgroundColor: '#262626',
  },
  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: '#262626',
    margin: '0 8px',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
  },
  userName: {
    color: '#a1a1a1',
    fontSize: '14px',
    fontWeight: '500',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: '#737373',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 150ms ease',
  },
  authButtons: {
    display: 'flex',
    gap: '8px',
  },
  loginBtn: {
    color: '#a1a1a1',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'all 150ms ease',
  },
  registerBtn: {
    color: '#fff',
    backgroundColor: '#3b82f6',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'all 150ms ease',
  },
};

export default Navbar;
