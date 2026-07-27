import Job from '../models/Job.js';

// Get jobs with filtering and sorting
export async function getAllJobs(req, res) {
  try {
    const { type, location, search, sortByDeadline } = req.query;

    let filter = { isActive: true };

    if (type) filter.type = type;

    if (location) filter.location = { $regex: location, $options: 'i' };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    let query = Job.find(filter);

    if (sortByDeadline === 'true') {
      // Sort by deadline: jobs with deadline first (soonest first), then jobs without deadline
      query = query.sort({ 
        deadline: 1,  // Ascending: soonest first
        postedAt: -1  // Then by posted date (newest first)
      });
    } else {
      query = query.sort({ postedAt: -1 });  // Default: newest first
    }

    const jobs = await query.limit(60);

    res.json({ count: jobs.length, jobs });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}