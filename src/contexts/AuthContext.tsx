import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: (callback?: () => void) => void;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// In a real app, this would be handled by a backend
const MOCK_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user was previously logged in
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (username === MOCK_CREDENTIALS.username && password === MOCK_CREDENTIALS.password) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      toast.success('Logged in successfully', { duration: 5000 });
      return true;
    }
    toast.error('Invalid credentials', { duration: 5000 });
    return false;
  };

  const logout = (callback?: () => void) => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    toast.success('Logged out successfully', { duration: 5000 });
    if (callback) {
      callback();
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};