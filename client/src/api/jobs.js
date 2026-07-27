import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchJobs = async (filters = {}) => {
  const params = {};

  if (filters.type) params.type = filters.type;
  if (filters.location) params.location = filters.location;
  if (filters.search) params.search = filters.search;
  if (filters.sortByDeadline) params.sortByDeadline = filters.sortByDeadline;

  const response = await axios.get(`${BASE_URL}/jobs`, { params });
  return response.data.jobs;
};
