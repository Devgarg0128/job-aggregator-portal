const JobCard = ({ job, isBookmarked, onBookmark, onTrack }) => {
  const getTimeRemaining = () => {
    if (!job.deadline) return null;
    
    const daysLeft = Math.ceil(
      (new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysLeft < 0) {
      return { text: 'Expired', color: '#71717a', urgency: 'expired' };
    }
    if (daysLeft === 0) {
      return { text: 'Today', color: '#ef4444', urgency: 'critical' };
    }
    if (daysLeft === 1) {
      return { text: '1 day left', color: '#ef4444', urgency: 'critical' };
    }
    if (daysLeft <= 3) {
      return { text: `${daysLeft}d left`, color: '#ef4444', urgency: 'urgent' };
    }
    if (daysLeft <= 7) {
      return { text: `${daysLeft}d left`, color: '#f59e0b', urgency: 'soon' };
    }
    return { text: `${daysLeft}d left`, color: '#22c55e', urgency: 'normal' };
  };

  const deadlineBadge = () => {
    const timeInfo = getTimeRemaining();
    if (!timeInfo) return null;

    if (timeInfo.urgency === 'expired') {
      return (
        <span style={{ ...styles.deadlineBadge, backgroundColor: '#27272a', color: '#71717a' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="m15 9-6 6M9 9l6 6"/>
          </svg>
          {timeInfo.text}
        </span>
      );
    }
    
    const bgColor = timeInfo.urgency === 'urgent' || timeInfo.urgency === 'critical' 
      ? 'rgba(239, 68, 68, 0.15)'
      : timeInfo.urgency === 'soon'
      ? 'rgba(245, 158, 11, 0.15)'
      : 'rgba(34, 197, 94, 0.15)';

    return (
      <span style={{ ...styles.deadlineBadge, backgroundColor: bgColor, color: timeInfo.color }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        {timeInfo.text}
      </span>
    );
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.companyLogo}>
          {job.company?.charAt(0).toUpperCase() || 'C'}
        </div>
        <div style={styles.headerInfo}>
          <div style={styles.titleRow}>
            <h3 style={styles.title}>{job.title}</h3>
            <span style={{
              ...styles.typeBadge,
              backgroundColor: job.type === 'internship' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(168, 85, 247, 0.15)',
              color: job.type === 'internship' ? '#3b82f6' : '#a855f7'
            }}>
              {job.type === 'internship' ? 'Internship' : 'Full-time'}
            </span>
          </div>
          <div style={styles.metaRow}>
            <span style={styles.company}>{job.company}</span>
            <span style={styles.metaDot}>·</span>
            <span style={styles.location}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {job.location || 'Remote'}
            </span>
            {job.deadline && (
              <>
                <span style={styles.metaDot}>·</span>
                <span style={{ ...styles.deadline, color: getTimeRemaining().color }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {getTimeRemaining().text}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <p style={styles.description}>{job.description}</p>

      {job.tags && job.tags.length > 0 && (
        <div style={styles.tags}>
          {job.tags.slice(0, 5).map((tag, i) => (
            <span key={i} style={styles.tag}>{tag}</span>
          ))}
          {job.tags.length > 5 && (
            <span style={styles.tagMore}>+{job.tags.length - 5}</span>
          )}
        </div>
      )}

      <div style={styles.footer}>
        <div style={styles.footerLeft}>
          {deadlineBadge()}
        </div>
        <div style={styles.footerRight}>
          <button 
            onClick={onBookmark} 
            style={{
              ...styles.bookmarkBtn,
              backgroundColor: isBookmarked ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              color: isBookmarked ? '#3b82f6' : '#737373',
              borderColor: isBookmarked ? '#3b82f6' : '#333333'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
            </svg>
            {isBookmarked ? 'Saved' : 'Save'}
          </button>

          <div style={styles.selectWrapper}>
            <select
              onChange={e => { if (e.target.value) onTrack(e.target.value); }}
              defaultValue=""
              style={styles.trackSelect}
            >
              <option value="" disabled>Track</option>
              <option value="saved">Save</option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="rejected">Rejected</option>
              <option value="offered">Offered</option>
            </select>
          </div>

          <a href={job.applyLink} target="_blank" rel="noreferrer" style={styles.applyBtn}>
            Apply
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#171717',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '12px',
    border: '1px solid #262626',
    transition: 'all 200ms ease',
  },
  header: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  companyLogo: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    backgroundColor: '#262626',
    color: '#a1a1a1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600',
    flexShrink: 0,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '6px',
    flexWrap: 'wrap',
  },
  title: {
    color: '#fafafa',
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    letterSpacing: '-0.01em',
  },
  typeBadge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '20px',
    textTransform: 'capitalize',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  company: {
    color: '#a1a1a1',
    fontSize: '13px',
    fontWeight: '500',
  },
  metaDot: {
    color: '#404040',
  },
  location: {
    color: '#737373',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  deadline: {
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontWeight: '600',
  },
  description: {
    color: '#a1a1a1',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '16px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  tags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  tag: {
    backgroundColor: '#262626',
    color: '#a1a1a1',
    fontSize: '12px',
    fontWeight: '500',
    padding: '5px 10px',
    borderRadius: '6px',
  },
  tagMore: {
    backgroundColor: 'transparent',
    color: '#737373',
    fontSize: '12px',
    fontWeight: '500',
    padding: '5px 8px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    paddingTop: '16px',
    borderTop: '1px solid #262626',
  },
  footerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  footerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  deadlineBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '600',
    padding: '6px 12px',
    borderRadius: '6px',
  },
  bookmarkBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '500',
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    backgroundColor: 'transparent',
  },
  selectWrapper: {
    position: 'relative',
  },
  trackSelect: {
    appearance: 'none',
    backgroundColor: '#262626',
    color: '#a1a1a1',
    border: '1px solid #333333',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  applyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    padding: '8px 18px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 150ms ease',
  },
};

export default JobCard;
