export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  fullName: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
