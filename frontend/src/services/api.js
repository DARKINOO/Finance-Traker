import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/users/login', {
    email: email,
    password: password
  });
  return response.data;
};

export const getTransactions = async (userId) => {
  const response = await api.get(`/transactions?user_id=${userId}`);
  return response.data;
};

export const addTransaction = async (transaction) => {
  const response = await api.post('/transactions', transaction);
  return response.data;
};

export const getSpendingByCategory = async (userId) => {
  const response = await api.get(`/insights/spending-by-category/${userId}`);
  return response.data;
};

export const getMonthlyTrend = async (userId) => {
  const response = await api.get(`/insights/monthly-trend/${userId}`);
  return response.data;
};

// export const predictCategory = async (amount) => {
//   const response = await api.post('/ml/predict/category', {
//     amount: parseFloat(amount)
//   });
//   return response.data;
// };

export const predictNextMonth = async () => {
  const response = await api.get('/ml/predict/next-month');
  return response.data;
};

export const predictCategory = async (amount, date = null) => {
  const response = await api.post('/ml/predict/category', {
    amount: parseFloat(amount),
    date
  });
  return response.data;
};