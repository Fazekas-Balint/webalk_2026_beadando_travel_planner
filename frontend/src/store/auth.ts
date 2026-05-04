import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setAuth: (user, accessToken) => set({ user, accessToken }),
      clear: () => set({ user: null, accessToken: null }),
    }),
    { name: 'tripplanner-auth' }
  )
);
