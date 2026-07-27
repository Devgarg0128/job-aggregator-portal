import { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import JobCard from '../components/JobCard';
import { fetchJobs } from '../api/jobs';
import { toggleBookmark, updateApplication, getMe } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', type: '', location: '', sortByDeadline: false });
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (user?.bookmarks) {
      setBookmarks(user.bookmarks.map(b => b._id || b));
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchJobs(filters);
        setJobs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleBookmark = async (jobId) => {
    if (!user) return alert('Please login to bookmark jobs');
    try {
      await toggleBookmark(jobId);
      const updatedUser = await getMe();
      setBookmarks(updatedUser.bookmarks.map(b => b._id || b));
    } catch (err) {
      console.error('Failed to bookmark:', err);
    }
  };

  const handleTrack = async (jobId, status) => {
    if (!user) return alert('Please login to track applications');
    await updateApplication(jobId, status);
  };

  return (
    <div style={styles.page}>
      <FilterBar filters={filters} onChange={setFilters} />
      
      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Find Your Next Opportunity</h1>
            <p style={styles.subtitle}>
              {loading ? 'Searching...' : `${jobs.length} jobs available`}
            </p>
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
                  <div style={styles.skeletonFooter}>
                    <div style={{ ...styles.skeletonLine, width: '80px' }}></div>
                    <div style={{ ...styles.skeletonLine, width: '100px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
              <h3 style={styles.emptyTitle}>No jobs found</h3>
              <p style={styles.emptyText}>
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
            </div>
          ) : (
            jobs.map((job, index) => (
              <JobCard
                key={job._id}
                job={job}
                isBookmarked={bookmarks.includes(job._id)}
                onBookmark={() => handleBookmark(job._id)}
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
  title: {
    color: '#fafafa',
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '-0.03em',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#737373',
    fontSize: '15px',
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
  skeletonFooter: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
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
    margin: 0,
    maxWidth: '300px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
};

export default Home;
