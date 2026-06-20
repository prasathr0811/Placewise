import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if token exists on load and fetch current user profile
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/api/auth/me');
          setUser(res.data);
        } catch (err) {
          console.error("Auth check failed:", err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { access_token, user } = res.data;
      localStorage.setItem('token', access_token);
      setUser(user);
      return user;
    } catch (err) {
      throw err.response?.data?.detail || "Login failed. Please try again.";
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/api/auth/register', userData);
      const { access_token, user } = res.data;
      localStorage.setItem('token', access_token);
      setUser(user);
      return user;
    } catch (err) {
      throw err.response?.data?.detail || "Registration failed. Please try again.";
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/api/auth/profile', profileData);
      setUser(res.data);
      return res.data;
    } catch (err) {
      throw err.response?.data?.detail || "Failed to update profile.";
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
