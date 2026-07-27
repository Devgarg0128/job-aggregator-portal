import { Router } from 'express';
import { toggleBookmark, updateApplication, getApplications } from '../controllers/userController.js';
import protect from '../middleware/auth.js';

const router = Router();

router.post('/bookmark/:jobId', protect, toggleBookmark);
router.post('/application', protect, updateApplication);
router.get('/applications', protect, getApplications);

export default router;
