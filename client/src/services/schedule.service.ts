import { API_ENDPOINTS } from '@/config/api-endpoint';

export interface CreateSessionData {
  giao_vien: number;
  ca_day: number;
  ngay_day: string;
}

export const scheduleService = {
  fetchSchedule: async (co_so_dao_tao: number, start_date: string, end_date: string) => {
    const params = new URLSearchParams({
      co_so_dao_tao: co_so_dao_tao.toString(),
      start_date,
      end_date
    });
    const res = await fetch(`${API_ENDPOINTS.SCHEDULE}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  },

  fetchTeachers: async () => {
    const res = await fetch(API_ENDPOINTS.TEACHERS);
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  },

  fetchShifts: async () => {
    const res = await fetch(API_ENDPOINTS.SHIFTS);
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  },

  fetchClasses: async (khoi: string) => {
    const params = new URLSearchParams({ khoi });
    const res = await fetch(`${API_ENDPOINTS.CLASSES}?${params.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  },

  createSession: async (data: CreateSessionData) => {
    const res = await fetch(API_ENDPOINTS.SESSIONS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error('Lỗi khi lưu ca dạy');
    }
    return res.json();
  }
};
