// src/context/AuthContext.js
// Global authentication context - provides user state and auth functions to all components

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

/**
 * AuthProvider wraps the entire app and provides:
 * - user: current logged-in user object (null if not logged in)
 * - token: JWT token
 * - login, register, logout functions
 * - loading state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // True while checking localStorage

  // On first load, check if user was previously logged in (persisted in localStorage)
  useEffect(() => {
    const savedUser  = localStorage.getItem('qm_user');
    const savedToken = localStorage.getItem('qm_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      // Set default Authorization header for all future axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    setLoading(false);
  }, []);

  /**
   * Register a new user account
   */
  const register = async (name, email, password) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
      name, email, password,
    });
    saveAuth(response.data);
    return response.data;
  };

  /**
   * Login with email and password
   */
  const login = async (email, password) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
      email, password,
    });
    saveAuth(response.data);
    return response.data;
  };

  /**
   * Save auth data to state and localStorage
   */
  const saveAuth = (data) => {
    setUser(data);
    setToken(data.token);
    localStorage.setItem('qm_user', JSON.stringify(data));
    localStorage.setItem('qm_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  /**
   * Logout - clear all auth data
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('qm_user');
    localStorage.removeItem('qm_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Check if user is an admin
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for using auth context
 * Usage: const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
