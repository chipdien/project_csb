import { useState, useEffect } from 'react';

export const useSchedule = (co_so_dao_tao: number, start_date: string, end_date: string) => {
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/schedule/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            co_so_dao_tao,
            start_date,
            end_date
          })
        });
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
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
