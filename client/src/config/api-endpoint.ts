export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  SCHEDULE: `${API_BASE_URL}/api/schedule/`,
  TEACHERS: `${API_BASE_URL}/api/giao-vien/`,
  SHIFTS: `${API_BASE_URL}/api/ca-day/`,
  SESSIONS: `${API_BASE_URL}/api/lich-day/`,
  CLASSES: `${API_BASE_URL}/api/lop/`,
};
