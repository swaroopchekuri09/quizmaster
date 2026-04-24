// src/services/api.js
// Centralized Axios API service layer

import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create Axios instance with base URL
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('qm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('qm_user');
      localStorage.removeItem('qm_token');
    }
    return Promise.reject(error);
  }
);

// ========================
// Auth Services
// ========================
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  profile:  ()     => api.get('/auth/profile'),
};

// ========================
// Topic Services
// ========================
export const topicService = {
  getAll:    ()         => api.get('/topics'),
  create:    (data)     => api.post('/topics', data),
  update:    (id, data) => api.put(`/topics/${id}`, data),
  delete:    (id)       => api.delete(`/topics/${id}`),
};

// ========================
// Quiz Services
// ========================
export const quizService = {
  getAll:         (params) => api.get('/quizzes', { params }),
  getById:        (id)     => api.get(`/quizzes/${id}`),
  create:         (data)   => api.post('/quizzes', data),
  update:         (id, data) => api.put(`/quizzes/${id}`, data),
  delete:         (id)     => api.delete(`/quizzes/${id}`),
  togglePublish:  (id)     => api.patch(`/quizzes/${id}/publish`),
};

// ========================
// Question Services
// ========================
export const questionService = {
  getByQuiz: (quizId)   => api.get(`/questions/quiz/${quizId}`),
  create:    (data)      => api.post('/questions', data),
  update:    (id, data)  => api.put(`/questions/${id}`, data),
  delete:    (id)        => api.delete(`/questions/${id}`),
};

// ========================
// Attempt Services
// ========================
export const attemptService = {
  submit:      (data)    => api.post('/attempts/submit', data),
  getMyAttempts: ()      => api.get('/attempts/my'),
  getByQuiz:   (quizId)  => api.get(`/attempts/quiz/${quizId}`),
  getById:     (id)      => api.get(`/attempts/${id}`),
};

// ========================
// Leaderboard Services
// ========================
export const leaderboardService = {
  overall:  ()          => api.get('/leaderboard/overall'),
  byQuiz:   (quizId)    => api.get(`/leaderboard/quiz/${quizId}`),
  byTopic:  (topicId)   => api.get(`/leaderboard/topic/${topicId}`),
};

// ========================
// Admin Services
// ========================
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
};

export default api;
