import { API_ENDPOINTS } from '@/config/api-endpoint';

// Fallback in-memory storage for environments where localStorage is blocked (e.g. strict iframes/incognito)
const memoryStorage: Record<string, string> = {};

const safeStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return memoryStorage[key] || null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      memoryStorage[key] = value;
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      delete memoryStorage[key];
    }
  }
};

export const authService = {
  login: async (username: string, password: string) => {
    const res = await fetch(API_ENDPOINTS.AUTH_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      throw new Error('Đăng nhập thất bại. Vui lòng kiểm tra lại!');
    }

    const data = await res.json();
    safeStorage.setItem('access_token', data.access);
    safeStorage.setItem('refresh_token', data.refresh);
    return data;
  },

  logout: () => {
    safeStorage.removeItem('access_token');
    safeStorage.removeItem('refresh_token');
  },

  getToken: () => {
    return safeStorage.getItem('access_token');
  },

  isAuthenticated: () => {
    return !!safeStorage.getItem('access_token');
  }
};
