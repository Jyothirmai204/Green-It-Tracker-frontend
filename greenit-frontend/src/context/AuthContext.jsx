import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getToken, setToken as persistToken } from '../api/client';
import { isExpired } from '../utils/jwt';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { userId, fullName, email }
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    const raw = localStorage.getItem('git_user');
    if (token && !isExpired(token) && raw) {
      setUser(JSON.parse(raw));
    } else {
      persistToken(null);
      localStorage.removeItem('git_user');
    }
    setReady(true);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    persistToken(data.token);
    const profile = { userId: data.userId, fullName: data.fullName, email: data.email };
    localStorage.setItem('git_user', JSON.stringify(profile));
    setUser(profile);
    return profile;
  }, []);

  const register = useCallback((payload) => authApi.register(payload), []);

  const logout = useCallback(() => {
    persistToken(null);
    localStorage.removeItem('git_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
