import { useCallback, useEffect, useState } from 'react';
import { scheduleService } from '@/services/schedule.service';

export const useSchedule = (coSoDaoTao: number, startDate: string, endDate: string) => {
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(async () => {
    try {
      setError(null);
      setIsRefetching(true);
      const data = await scheduleService.fetchSchedule(coSoDaoTao, startDate, endDate);
      setScheduleData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [coSoDaoTao, startDate, endDate]);

  useEffect(() => {
    setIsLoading(true);
    fetchSchedule();
  }, [fetchSchedule]);

  return { scheduleData, isLoading, isRefetching, error, refetch: fetchSchedule };
};
