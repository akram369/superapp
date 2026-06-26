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
  registerUser: (user: User) => void;
  loginUser: (username: string) => boolean;
  logoutUser: () => void;
  toggleCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  saveNotes: (notes: string) => void;
  clearStore: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      selectedCategories: [],
      notes: '',
      isRegistered: false,
      isLoggedIn: false,
      registerUser: (user: User) => set({ user, isRegistered: true, isLoggedIn: true }),
      loginUser: (username: string) => {
        const state = get();
        if (state.user && state.user.username.trim().toLowerCase() === username.trim().toLowerCase()) {
          set({ isLoggedIn: true });
          return true;
        }
        return false;
      },
      logoutUser: () => set({ isLoggedIn: false }),
      toggleCategory: (category: string) =>
        set((state) => {
          const exists = state.selectedCategories.includes(category);
          if (exists) {
            return {
              selectedCategories: state.selectedCategories.filter((c) => c !== category),
            };
          } else {
            return {
              selectedCategories: [...state.selectedCategories, category],
            };
          }
        }),
      removeCategory: (category: string) =>
        set((state) => ({
          selectedCategories: state.selectedCategories.filter((c) => c !== category),
        })),
      saveNotes: (notes: string) => set({ notes }),
      clearStore: () => set({ user: null, selectedCategories: [], notes: '', isRegistered: false, isLoggedIn: false }),
    }),
    {
      name: 'super-app-storage', // key in local storage
    }
  )
);
