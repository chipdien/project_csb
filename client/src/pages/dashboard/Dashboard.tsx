import React from 'react';
import WeeklySchedule from '@/components/dashboard/WeeklySchedule';
import { useSchedule } from '@/pages/dashboard/hooks/useSchedule';

const Dashboard: React.FC = () => {
  const { scheduleData, isLoading, error } = useSchedule(1, '2026-04-05', '2026-04-11');

  if (isLoading) {
    return <div className="p-8 min-h-full bg-white flex items-center justify-center">Loading schedule...</div>;
  }

  if (error) {
    return <div className="p-8 min-h-full bg-white flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8 min-h-full bg-white">
      {/* Header & Date Range */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Quản lý ca dạy lớp học</h2>
          <p className="text-outline font-medium mt-1">{scheduleData?.week_range || 'Oct 21 - 27, 2026'} • Academic Term 1</p>
        </div>
        <div className="flex gap-2 bg-surface-container-low p-1 rounded-full">
          <button className="px-4 py-1.5 rounded-full bg-white text-xs font-bold text-primary shadow-sm">Tuần</button>
          <button className="px-4 py-1.5 rounded-full text-xs font-bold text-outline hover:text-primary transition-colors">Tháng</button>
          <button className="px-4 py-1.5 rounded-full text-xs font-bold text-outline hover:text-primary transition-colors">Ngày</button>
        </div>
      </div>

      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold text-red-500'>***Chú ý: Các ca màu đỏ là các ca có giáo viên bị trùng lịch dạy***</h2>
      </div>
      {/* Weekly Grid */}
      <WeeklySchedule scheduleData={scheduleData} />
    </div>
  );
};

export default Dashboard;
