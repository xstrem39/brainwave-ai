'use client';

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user] = useState({
    id: 'guest_user',
    name: 'Guest User',
    email: 'guest@brainwave.ai',
    role: 'student',
    status: 'active',
    subscription: 'free',
    credits: 99999
  });

  const login = async () => {
    return { success: true };
  };

  const register = async () => {
    return { success: true };
  };

  const logout = async () => {
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: true,
        loading: false,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
