import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// attach token to every request automatically
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = async (name, email, password) => {
  const res = await axios.post(`${BASE_URL}/auth/register`, { name, email, password });
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
  return res.data;
};

export const getMe = async () => {
  const res = await axios.get(`${BASE_URL}/auth/me`);
  return res.data;
};

export const toggleBookmark = async (jobId) => {
  const res = await axios.post(`${BASE_URL}/user/bookmark/${jobId}`);
  return res.data;
};

export const updateApplication = async (jobId, status, notes = '') => {
  const res = await axios.post(`${BASE_URL}/user/application`, { jobId, status, notes });
  return res.data;
};

export const getApplications = async () => {
  const res = await axios.get(`${BASE_URL}/user/applications`);
  return res.data;
};
