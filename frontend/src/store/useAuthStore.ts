import { create } from 'zustand';

interface User {
  id: string;
  _id?: string;
  email: string;
  role: 'buyer' | 'artist' | 'admin';
  name?: string;
  firstName: string;
  lastName: string;
  penName?: string;
  username?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('aura_token') || null,
  user: (() => {
    const storedUser = localStorage.getItem('aura_user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  })(),
  setAuth: (token, user) => {
    localStorage.setItem('aura_token', token);
    localStorage.setItem('aura_user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('aura_token');
    localStorage.removeItem('aura_user');
    set({ token: null, user: null });
  },
}));
