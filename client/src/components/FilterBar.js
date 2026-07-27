const FilterBar = ({ filters, onChange }) => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.bar}>
          <div style={styles.searchGroup}>
            <div style={styles.searchIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <input
              style={styles.searchInput}
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={filters.search}
              onChange={e => onChange({ ...filters, search: e.target.value })}
            />
          </div>

          <div style={styles.filters}>
            <div style={styles.selectWrapper}>
              <select
                style={styles.select}
                value={filters.type}
                onChange={e => onChange({ ...filters, type: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="internship">Internship</option>
                <option value="full-time">Full Time</option>
              </select>
              <div style={styles.selectArrow}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </div>

            <div style={styles.inputWrapper}>
              <div style={styles.locationIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <input
                style={styles.locationInput}
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={e => onChange({ ...filters, location: e.target.value })}
              />
            </div>

            <label style={styles.checkbox}>
              <input
                type="checkbox"
                checked={filters.sortByDeadline}
                onChange={e => onChange({ ...filters, sortByDeadline: e.target.checked })}
                style={styles.checkboxInput}
              />
              <span style={styles.checkboxCustom}>
                {filters.sortByDeadline && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </span>
              <span style={styles.checkboxLabel}>Deadline first</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: '#0a0a0a',
    borderBottom: '1px solid #262626',
    position: 'sticky',
    top: '64px',
    zIndex: 90,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '16px 24px',
  },
  bar: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchGroup: {
    flex: '1',
    minWidth: '280px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    color: '#737373',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 46px',
    borderRadius: '10px',
    border: '1px solid #262626',
    backgroundColor: '#171717',
    color: '#fafafa',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 150ms ease',
  },
  filters: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  selectWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  select: {
    appearance: 'none',
    padding: '12px 36px 12px 16px',
    borderRadius: '10px',
    border: '1px solid #262626',
    backgroundColor: '#171717',
    color: '#fafafa',
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 150ms ease',
  },
  selectArrow: {
    position: 'absolute',
    right: '12px',
    color: '#737373',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  locationIcon: {
    position: 'absolute',
    left: '12px',
    color: '#737373',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  locationInput: {
    padding: '12px 16px 12px 36px',
    borderRadius: '10px',
    border: '1px solid #262626',
    backgroundColor: '#171717',
    color: '#fafafa',
    fontSize: '14px',
    width: '160px',
    outline: 'none',
    transition: 'all 150ms ease',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #262626',
    backgroundColor: '#171717',
    transition: 'all 150ms ease',
  },
  checkboxInput: {
    display: 'none',
  },
  checkboxCustom: {
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    border: '2px solid #404040',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3b82f6',
    transition: 'all 150ms ease',
  },
  checkboxLabel: {
    color: '#a1a1a1',
    fontSize: '14px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
};

export default FilterBar;
