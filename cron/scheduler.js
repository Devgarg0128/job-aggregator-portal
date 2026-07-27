import { schedule } from 'node-cron';
import fetchAllJobs from './fetchJobs.js';

// runs every day at midnight
schedule('0 0 * * *', async () => {
  console.log('Cron triggered — fetching jobs from all sources...');
  await fetchAllJobs();
});

console.log('Scheduler initialized');
