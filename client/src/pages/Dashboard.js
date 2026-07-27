import { useState, useEffect } from 'react';
import { getApplications, updateApplication } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const statusConfig = {
  saved: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', label: 'Saved' },
  applied: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', label: 'Applied' },
  interviewing: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', label: 'Interviewing' },
  rejected: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', label: 'Rejected' },
  offered: { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', label: 'Offered' }
};

const Dashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApplications()
      .then(data => setApplications(data.applications))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (jobId, newStatus) => {
    await updateApplication(jobId, newStatus);
    setApplications(prev =>
      prev.map(app =>
        app.job._id === jobId ? { ...app, status: newStatus } : app
      )
    );
  };

  const statuses = ['saved', 'applied', 'interviewing', 'rejected', 'offered'];

  const getStats = () => {
    const total = applications.length;
    const statusCounts = statuses.reduce((acc, s) => {
      acc[s] = applications.filter(app => app.status === s).length;
      return acc;
    }, {});
    return { total, ...statusCounts };
  };

  const stats = getStats();

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.iconContainer}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20V10"/>
                <path d="M18 20V4"/>
                <path d="M6 20v-4"/>
              </svg>
            </div>
            <div>
              <h1 style={styles.title}>Application Tracker</h1>
              <p style={styles.subtitle}>
                Welcome back, {user?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Tracked</p>
            <p style={styles.statValue}>{stats.total}</p>
          </div>
          {statuses.slice(0, 4).map(status => (
            <div key={status} style={styles.statCard}>
              <p style={styles.statLabel}>{statusConfig[status].label}</p>
              <p style={{
                ...styles.statValue,
                color: statusConfig[status].color
              }}>{stats[status]}</p>
            </div>
          ))}
        </div>

        {/* Applications by Status */}
        {loading ? (
          <div style={styles.loadingState}>
            {[1, 2, 3].map(i => (
              <div key={i} style={styles.skeleton}>
                <div style={styles.skeletonLine}></div>
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 20V10"/>
                <path d="M18 20V4"/>
                <path d="M6 20v-4"/>
              </svg>
            </div>
            <h3 style={styles.emptyTitle}>No applications tracked</h3>
            <p style={styles.emptyText}>
              Start tracking your job applications by using the Track dropdown on job cards.
            </p>
            <a href="/" style={styles.browseBtn}>
              Browse Jobs
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        ) : (
          <div style={styles.statusGroups}>
            {statuses.map(status => {
              const group = applications.filter(app => app.status === status);
              if (group.length === 0) return null;

              return (
                <div key={status} style={styles.statusGroup}>
                  <div style={styles.statusHeader}>
                    <div style={{
                      ...styles.statusBadge,
                      backgroundColor: statusConfig[status].bg,
                      color: statusConfig[status].color
                    }}>
                      {group.length}
                    </div>
                    <h3 style={styles.statusTitle}>{statusConfig[status].label}</h3>
                  </div>

                  <div style={styles.applicationsList}>
                    {group.map((app, index) => (
                      <div 
                        key={app.job._id} 
                        style={styles.applicationCard}
                      >
                        <div style={styles.appLogo}>
                          {app.job.company?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div style={styles.appInfo}>
                          <p style={styles.appTitle}>{app.job.title}</p>
                          <p style={styles.appMeta}>
                            {app.job.company} · {app.job.location || 'Remote'}
                          </p>
                        </div>
                        <div style={styles.appActions}>
                          <select
                            value={app.status}
                            onChange={e => handleStatusChange(app.job._id, e.target.value)}
                            style={{
                              ...styles.statusSelect,
                              backgroundColor: statusConfig[app.status].bg,
                              color: statusConfig[app.status].color,
                              borderColor: statusConfig[app.status].color
                            }}
                          >
                            {statuses.map(s => (
                              <option key={s} value={s}>{statusConfig[s].label}</option>
                            ))}
                          </select>
                          {app.job.applyLink && (
                            <a 
                              href={app.job.applyLink} 
                              target="_blank" 
                              rel="noreferrer" 
                              style={styles.viewBtn}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#0a0a0a',
    minHeight: '100vh',
  },
  main: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  header: {
    marginBottom: '32px',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  iconContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    color: '#a855f7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fafafa',
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    margin: '0 0 4px 0',
  },
  subtitle: {
    color: '#737373',
    fontSize: '14px',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: '#171717',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #262626',
  },
  statLabel: {
    color: '#737373',
    fontSize: '13px',
    margin: '0 0 8px 0',
    fontWeight: '500',
  },
  statValue: {
    color: '#fafafa',
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  statusGroups: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  statusGroup: {},
  statusHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
  },
  statusTitle: {
    color: '#fafafa',
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
  },
  applicationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  applicationCard: {
    backgroundColor: '#171717',
    borderRadius: '10px',
    padding: '16px 20px',
    border: '1px solid #262626',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  appLogo: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: '#262626',
    color: '#a1a1a1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '600',
    flexShrink: 0,
  },
  appInfo: {
    flex: 1,
    minWidth: 0,
  },
  appTitle: {
    color: '#fafafa',
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 4px 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  appMeta: {
    color: '#737373',
    fontSize: '13px',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  appActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  statusSelect: {
    appearance: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    textTransform: 'capitalize',
  },
  viewBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '6px',
    backgroundColor: '#262626',
    color: '#a1a1a1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'all 150ms ease',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  skeleton: {
    backgroundColor: '#171717',
    borderRadius: '10px',
    padding: '24px',
    border: '1px solid #262626',
  },
  skeletonLine: {
    height: '40px',
    borderRadius: '6px',
    backgroundColor: '#262626',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 24px',
    backgroundColor: '#171717',
    borderRadius: '12px',
    border: '1px solid #262626',
  },
  emptyIcon: {
    color: '#404040',
    marginBottom: '16px',
  },
  emptyTitle: {
    color: '#fafafa',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 8px 0',
  },
  emptyText: {
    color: '#737373',
    fontSize: '14px',
    margin: '0 0 24px 0',
    maxWidth: '320px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  browseBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 150ms ease',
  },
};

export default Dashboard;
