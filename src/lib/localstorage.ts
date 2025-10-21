// src/lib/localstorage.ts

/**
 * ✅ Safe localStorage helper for Next.js
 * Empêche les erreurs côté serveur (window undefined)
 * Fournit une API simple : setItem, getItem, removeItem, clear, etc.
 */

export function setItem(key: string, value: any): void {
  if (typeof window === "undefined") return;
  try {
    const data = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, data);
  } catch (err) {
    console.error("❌ localStorage setItem error:", err);
  }
}

export function getItem<T = any>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T; // Si c’est une simple string
    }
  } catch (err) {
    console.error("❌ localStorage getItem error:", err);
    return null;
  }
}

export function removeItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error("❌ localStorage removeItem error:", err);
  }
}

export function clearStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.clear();
  } catch (err) {
    console.error("❌ localStorage clearStorage error:", err);
  }
}

/**
 * 🔹 Utilitaires supplémentaires
 */

export function hasItem(key: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(key) !== null;
}

/**
 * 🔹 Fonctions spécifiques à ton projet
 * (pour éviter de manipuler directement les clés partout)
 */

export const storageKeys = {
  token: "token",
  user: "user",
};

export const storage = {
  saveUser(user: any) {
    setItem(storageKeys.user, user);
  },

  getUser() {
    return getItem(storageKeys.user);
  },

  saveToken(token: string) {
    setItem(storageKeys.token, token);
  },

  getToken() {
    return getItem<string>(storageKeys.token);
  },

  clearAuth() {
    removeItem(storageKeys.token);
    removeItem(storageKeys.user);
  },
};
