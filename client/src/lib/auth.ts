import { User } from "@shared/schema";

const AUTH_STORAGE_KEY = "learnhub_auth";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export function saveAuthState(user: User | null): void {
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function loadAuthState(): User | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load auth state:", error);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  return null;
}

export function clearAuthState(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
