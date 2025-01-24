// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // Backend URL
});

export const registerUser = async (data) => {
  return api.post('/admin/register-user', data);
};

export const loginUser = async (data) => {
  return api.post('/login', data);
};

// Add other API functions as required
