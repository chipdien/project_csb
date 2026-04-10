import { useState, useEffect, useCallback } from 'react';
import { scheduleService } from '@/services/schedule.service';

export const useSchedule = (co_so_dao_tao: number, start_date: string, end_date: string) => {
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(async () => {
    try {
      setIsRefetching(true);
      const data = await scheduleService.fetchSchedule(co_so_dao_tao, start_date, end_date);
      setScheduleData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [co_so_dao_tao, start_date, end_date]);

  useEffect(() => {
    setIsLoading(true);
    fetchSchedule();
  }, [fetchSchedule]);

  return { scheduleData, isLoading, isRefetching, error, refetch: fetchSchedule };
};
