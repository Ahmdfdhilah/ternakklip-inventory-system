import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CurrentUser } from '@/services/auth/types';

export type { CurrentUser };

interface AuthState {
  userData: CurrentUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  setUserData: (userData: CurrentUser) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => Promise<void>;
}

const initialState: AuthState = {
  userData: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,

      setUserData: (userData) => {
        set({ userData, isAuthenticated: true, error: null });
      },

      clearAuth: () => {
        set(initialState);
      },

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      logout: async () => {
        const { authService } = await import('@/services/auth/service');
        try {
          await authService.signOut();
        } catch {
        }
        set(initialState);
      },
    }),
    {
      name: 'app-auth',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ userData: state.userData }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.userData) {
            state.isAuthenticated = true;
          } else {
            state.isAuthenticated = false;
          }
        }
      },
    }
  )
);
