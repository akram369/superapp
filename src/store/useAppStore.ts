import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  name: string;
  username: string;
  email: string;
  mobile: string;
  agreedToShare: boolean;
}

export interface AppState {
  user: User | null;
  selectedCategories: string[];
  notes: string;
  isRegistered: boolean;
  isLoggedIn: boolean;
  registerUser: (user: User) => Promise<boolean>;
  loginUser: (username: string) => Promise<boolean>;
  logoutUser: () => void;
  toggleCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  saveNotes: (notes: string) => void;
  clearStore: () => void;
}

let notesTimeout: NodeJS.Timeout;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      selectedCategories: [],
      notes: '',
      isRegistered: false,
      isLoggedIn: false,
      registerUser: async (user: User) => {
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
          });
          if (!res.ok) return false;
          const data = await res.json();
          set({ user: data.user, isRegistered: true, isLoggedIn: true, selectedCategories: [], notes: '' });
          return true;
        } catch (err) {
          console.error('Registration API error:', err);
          return false;
        }
      },
      loginUser: async (username: string) => {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
          });
          if (!res.ok) return false;
          const data = await res.json();
          set({
            user: data.user,
            selectedCategories: data.selectedCategories,
            notes: data.notes,
            isRegistered: true,
            isLoggedIn: true,
          });
          return true;
        } catch (err) {
          console.error('Login API error:', err);
          return false;
        }
      },
      logoutUser: () => set({ isLoggedIn: false }),
      toggleCategory: (category: string) => {
        set((state) => {
          const exists = state.selectedCategories.includes(category);
          const newCategories = exists
            ? state.selectedCategories.filter((c) => c !== category)
            : [...state.selectedCategories, category];

          if (state.user) {
            fetch('/api/user/save-categories', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: state.user.username, categories: newCategories }),
            }).catch((err) => console.error('Failed to sync categories:', err));
          }

          return { selectedCategories: newCategories };
        });
      },
      removeCategory: (category: string) => {
        set((state) => {
          const newCategories = state.selectedCategories.filter((c) => c !== category);

          if (state.user) {
            fetch('/api/user/save-categories', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: state.user.username, categories: newCategories }),
            }).catch((err) => console.error('Failed to sync categories:', err));
          }

          return { selectedCategories: newCategories };
        });
      },
      saveNotes: (notes: string) => {
        set({ notes });
        const state = get();
        if (state.user) {
          clearTimeout(notesTimeout);
          notesTimeout = setTimeout(async () => {
            try {
              await fetch('/api/user/save-notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: state.user!.username, notes }),
              });
            } catch (err) {
              console.error('Failed to sync notes:', err);
            }
          }, 1000);
        }
      },
      clearStore: () => set({ user: null, selectedCategories: [], notes: '', isRegistered: false, isLoggedIn: false }),
    }),
    {
      name: 'super-app-storage', 
    }
  )
);
