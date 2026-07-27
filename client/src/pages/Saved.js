import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMe, toggleBookmark, updateApplication } from '../api/auth';
import JobCard from '../components/JobCard';

const Saved = () => {
  const { user } = useAuth();
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookmarkedJobs = useCallback(async () => {
    if (user) {
      try {
        const data = await getMe();
        setBookmarkedJobs(data.bookmarks || []);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    loadBookmarkedJobs();
  }, [loadBookmarkedJobs]);

  const handleRemoveBookmark = async (jobId) => {
    try {
      await toggleBookmark(jobId);
      const data = await getMe();
      setBookmarkedJobs(data.bookmarks || []);
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    }
  };

  const handleTrack = async (jobId, status) => {
    await updateApplication(jobId, status);
  };

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.iconContainer}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
              </svg>
            </div>
            <div>
              <h1 style={styles.title}>Saved Jobs</h1>
              <p style={styles.subtitle}>
                {loading ? 'Loading...' : `${bookmarkedJobs.length} jobs saved`}
              </p>
            </div>
          </div>
        </div>
        
        <div style={styles.jobsList}>
          {loading ? (
            <div style={styles.loadingState}>
              {[1, 2, 3].map(i => (
                <div key={i} style={styles.skeleton}>
                  <div style={styles.skeletonHeader}>
                    <div style={styles.skeletonAvatar}></div>
                    <div style={styles.skeletonLines}>
                      <div style={{ ...styles.skeletonLine, width: '60%' }}></div>
                      <div style={{ ...styles.skeletonLine, width: '40%' }}></div>
                    </div>
                  </div>
                  <div style={{ ...styles.skeletonLine, width: '100%', height: '40px' }}></div>
                </div>
              ))}
            </div>
          ) : bookmarkedJobs.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                </svg>
              </div>
              <h3 style={styles.emptyTitle}>No saved jobs yet</h3>
              <p style={styles.emptyText}>
                Jobs you save will appear here. Browse jobs and click the save button to add them.
              </p>
              <a href="/" style={styles.browseBtn}>
                Browse Jobs
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          ) : (
            bookmarkedJobs.map((job, index) => (
              <JobCard
                key={job._id}
                job={job}
                isBookmarked={true}
                onBookmark={() => handleRemoveBookmark(job._id)}
                onTrack={(status) => handleTrack(job._id, status)}
              />
            ))
          )}
        </div>
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
    maxWidth: '900px',
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
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    color: '#3b82f6',
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
  jobsList: {
    display: 'flex',
    flexDirection: 'column',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  skeleton: {
    backgroundColor: '#171717',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #262626',
  },
  skeletonHeader: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  skeletonAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    backgroundColor: '#262626',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  skeletonLines: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    justifyContent: 'center',
  },
  skeletonLine: {
    height: '14px',
    borderRadius: '4px',
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

export default Saved;
