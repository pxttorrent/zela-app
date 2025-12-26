import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { UserData, View } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('zela_token');
    if (!token) {
      setLoading(false);
      return null;
    }

    try {
      const { user } = await api.getMe(token);
      setUser(user);
      return user;
    } catch (err) {
      localStorage.removeItem('zela_token');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const { user, token } = await api.login(email, pass);
    localStorage.setItem('zela_token', token);
    setUser(user);
    return user;
  };

  const signup = async (name: string, email: string, pass: string) => {
    const { user, token } = await api.signup(name, email, pass);
    localStorage.setItem('zela_token', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('zela_token');
    setUser(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { user, loading, login, signup, logout, setUser };
};
