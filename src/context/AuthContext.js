import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [subscription, setSubscription] = useState(null);

  const loadUser = useCallback(async () => {
    if (!authService.isLoggedIn()) {
      setLoading(false);
      return;
    }
    try {
      const result = await authService.getMe();
      if (result.success) {
        setUser(result.user);
        setCredits(result.user.credits || 0);
        setSubscription(result.user.subscription || null);
      } else {
        authService.logout();
      }
    } catch {
      authService.logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      setUser(result.user);
      setCredits(result.user.credits || 0);
      setSubscription(result.user.subscription || null);
    }
    return result;
  };

  const register = async (data) => {
    return authService.register(data);
  };

  const googleLogin = async (googleData) => {
    const result = await authService.googleLogin(googleData);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setCredits(0);
    setSubscription(null);
  };

  const refreshCredits = async () => {
    try {
      const result = await userService.getCredits();
      if (result.success) setCredits(result.credits);
    } catch {}
  };

  const updateUser = (data) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  const hasRole = (roles) => {
    if (!user) return false;
    return Array.isArray(roles) ? roles.includes(user.role) : user.role === roles;
  };

  const isSubscribed = () => {
    if (!subscription) return false;
    return subscription.status === 'active' && new Date(subscription.endDate) > new Date();
  };

  return (
    <AuthContext.Provider value={{
      user, loading, credits, subscription,
      login, register, googleLogin, logout,
      refreshCredits, updateUser, loadUser,
      hasRole, isSubscribed,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
