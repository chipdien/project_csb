import { API_ENDPOINTS } from '@/config/api-endpoint';
import { authService } from './auth.service';

export interface CreateSessionData {
  giao_vien: number;
  ca_day: number;
  ngay_day: string;
}

export interface CreateShiftData {
  lop: number;
  ten_ca: string;
  gio_bat_dau: string;
  gio_ket_thuc: string;
}

const getAuthHeaders = () => {
  const token = authService.getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

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
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
    });
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  },

  fetchTeachers: async () => {
    const res = await fetch(API_ENDPOINTS.TEACHERS, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  },

  fetchShifts: async () => {
    const res = await fetch(API_ENDPOINTS.SHIFTS, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  },

  fetchClasses: async (khoi: string, co_so_dao_tao?: number) => {
    const params = new URLSearchParams({ khoi });
    if (co_so_dao_tao) {
      params.append('co_so_dao_tao', co_so_dao_tao.toString());
    }
    const res = await fetch(`${API_ENDPOINTS.CLASSES}?${params.toString()}`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  },

  createShift: async (data: CreateShiftData) => {
    const res = await fetch(API_ENDPOINTS.SHIFTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      let errorMsg = 'Lỗi khi tạo ca dạy';
      try {
        const errData = await res.json();
        errorMsg = errData.detail || (typeof errData === 'string' ? errData : JSON.stringify(errData));
      } catch (e) {
        errorMsg = await res.text();
      }
      throw new Error(errorMsg);
    }
    return res.json();
  },

  createSession: async (data: CreateSessionData) => {
    const res = await fetch(API_ENDPOINTS.SESSIONS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      let errorMsg = 'Lỗi khi lưu ca dạy';
      try {
        const errData = await res.json();
        errorMsg = errData.detail || (typeof errData === 'string' ? errData : JSON.stringify(errData));
      } catch (e) {
        errorMsg = await res.text();
      }
      throw new Error(errorMsg);
    }
    return res.json();
  },

  updateSession: async (id: number, data: CreateSessionData) => {
    const res = await fetch(`${API_ENDPOINTS.SESSIONS}${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      let errorMsg = 'Lỗi khi cập nhật ca dạy';
      try {
        const errData = await res.json();
        errorMsg = errData.detail || (typeof errData === 'string' ? errData : JSON.stringify(errData));
      } catch (e) {
        errorMsg = await res.text();
      }
      throw new Error(errorMsg);
    }
    return res.json();
  },

  deleteSession: async (id: number) => {
    const res = await fetch(`${API_ENDPOINTS.SESSIONS}${id}/`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) {
      throw new Error('Lỗi khi xóa ca dạy');
    }
    return true;
  }
};
