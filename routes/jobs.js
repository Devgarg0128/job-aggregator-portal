import { Router } from 'express';
const router = Router();
import { getAllJobs } from '../controllers/jobController.js';
import fetchAllJobs from '../cron/fetchJobs.js';

router.get('/', getAllJobs);

router.get('/fetch-now', async (req, res) => {
  await fetchAllJobs();
  res.json({ message: 'Fetch complete — all sources' });
});

export default router;