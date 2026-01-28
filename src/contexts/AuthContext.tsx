import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  AuthContextType,
  AuthUser,
  User,
  LoginCredentials,
  RegisterData,
} from '../types/auth.types';
import {
  STORAGE_KEYS,
  getFromStorage,
  saveToStorage,
  removeFromStorage,
} from '../utils/localStorage';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Load current user from localStorage on mount
    const currentUser = getFromStorage<AuthUser | null>(
      STORAGE_KEYS.CURRENT_USER,
      null
    );
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);

      const foundUser = users.find(
        (u) => u.username === credentials.username
      );

      if (!foundUser) {
        return false;
      }

      // Simple password comparison (in production, use proper hashing)
      if (foundUser.password !== btoa(credentials.password)) {
        return false;
      }

      const authUser: AuthUser = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        fullName: foundUser.fullName,
      };

      setUser(authUser);
      saveToStorage(STORAGE_KEYS.CURRENT_USER, authUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);

      // Check if username or email already exists
      const usernameExists = users.some((u) => u.username === data.username);
      const emailExists = users.some((u) => u.email === data.email);

      if (usernameExists || emailExists) {
        return false;
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        username: data.username,
        email: data.email,
        password: btoa(data.password), // Simple encoding (use bcrypt in production)
        fullName: data.fullName,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      saveToStorage(STORAGE_KEYS.USERS, users);

      // Auto-login after registration
      const authUser: AuthUser = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
      };

      setUser(authUser);
      saveToStorage(STORAGE_KEYS.CURRENT_USER, authUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    removeFromStorage(STORAGE_KEYS.CURRENT_USER);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: user !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
