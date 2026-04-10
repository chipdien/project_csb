import { useState, useEffect } from 'react';
import { scheduleService } from '@/services/schedule.service';

export const useSchedule = (co_so_dao_tao: number, start_date: string, end_date: string) => {
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setIsLoading(true);
        const data = await scheduleService.fetchSchedule(co_so_dao_tao, start_date, end_date);
        setScheduleData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [co_so_dao_tao, start_date, end_date]);

  return { scheduleData, isLoading, error };
};
