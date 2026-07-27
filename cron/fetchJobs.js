import axios from 'axios';
import Job from '../models/Job.js';
import scrapeInternshala from '../scrapers/internshala.js';

const fetchFromJSearch = async () => {
  const queries = ['software engineer intern', 'full stack developer', 'backend developer intern'];

  for (const query of queries) {
    try {
      const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
        params: {
          query: query,
          page: '1',
          num_pages: '1',
          country: 'in'          // India-focused results
        },
        headers: {
          'X-RapidAPI-Key': process.env.JSEARCH_API_KEY,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
      });

      const jobs = response.data.data;

      for (const job of jobs) {
        try {
          await Job.create({
            title: job.job_title,
            company: job.employer_name,
            location: job.job_city || job.job_country,
            type: job.job_is_remote ? 'full-time' : detectType(job.job_title),
            applyLink: job.job_apply_link,
            deadline: job.job_offer_expiration_datetime_utc
              ? new Date(job.job_offer_expiration_datetime_utc)
              : null,
            postedAt: new Date(job.job_posted_at_datetime_utc),
            source: 'jsearch',
            tags: job.job_required_skills || [],
            salary: job.job_salary_period || null,
            description: job.job_description?.slice(0, 500) || ''
          });
        } catch (err) {
          // duplicate key error = job already exists, skip silently
          if (err.code !== 11000) console.error('Insert error:', err.message);
        }
      }

      console.log(`✓ Fetched jobs for: "${query}"`);

    } catch (err) {
      console.error(`✗ Failed for query "${query}":`, err.message);
    }
  }
};

// Helper to guess job type from title
const detectType = (title = '') => {
  const t = title.toLowerCase();
  if (t.includes('intern')) return 'internship';
  if (t.includes('full')) return 'full-time';
  return 'other';
};

// NEW — runs both sources together
const fetchAllJobs = async () => {
  console.log('Fetching from JSearch...');
  await fetchFromJSearch();

  console.log('Scraping Internshala...');
  await scrapeInternshala();

  console.log('✓ All sources fetched successfully');
};

export default fetchAllJobs;
export { fetchFromJSearch };
