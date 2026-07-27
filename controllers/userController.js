import User from '../models/User.js';

// TOGGLE BOOKMARK
export const toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const jobId = req.params.jobId;

    const isBookmarked = user.bookmarks.some(id => id.toString() === jobId);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== jobId);
    } else {
      user.bookmarks.push(jobId);
    }

    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD / UPDATE APPLICATION STATUS
export const updateApplication = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { jobId, status, notes } = req.body;

    const existing = user.applications.find(
      app => app.job.toString() === jobId
    );

    if (existing) {
      existing.status = status || existing.status;
      existing.notes = notes || existing.notes;
    } else {
      user.applications.push({ job: jobId, status: status || 'saved', notes });
    }

    await user.save();
    res.json({ applications: user.applications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL APPLICATIONS
export const getApplications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('applications.job');
    res.json({ applications: user.applications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
