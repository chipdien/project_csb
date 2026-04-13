import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import WeeklySchedule from '@/pages/dashboard/components/WeeklySchedule';
import WeekPickerModal from '@/pages/dashboard/components/WeekPickerModal';
import { useSchedule } from '@/pages/dashboard/hooks/useSchedule';
import { getWeekRange } from '@/utils/timeUtils';

const Dashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { start, end } = getWeekRange(currentDate);
  const { scheduleData, isLoading, error, refetch } = useSchedule(1, start, end);

  if (isLoading) {
    return <div className="p-8 min-h-full bg-white flex items-center justify-center">Loading schedule...</div>;
  }

  if (error) {
    return <div className="p-8 min-h-full bg-white flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  const startDateObj = new Date(start);
  const endDateObj = new Date(end);
  const labelStart = `${String(startDateObj.getDate()).padStart(2, '0')}/${String(startDateObj.getMonth() + 1).padStart(2, '0')}`;
  const labelEnd = `${String(endDateObj.getDate()).padStart(2, '0')}/${String(endDateObj.getMonth() + 1).padStart(2, '0')}`;
  const weekLabel = `Tuần: ${labelStart} - ${labelEnd}`;
  return (
    <div className="p-8 min-h-full bg-white">
      {/* Header & Date Range */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Quản lý ca dạy lớp học</h2>
          <p className="text-outline font-medium mt-1">{scheduleData?.week_range || weekLabel} • Academic Term 1</p>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-outline-variant/60 rounded-lg bg-white hover:bg-slate-50 hover:border-primary/50 transition-all shadow-sm"
          >
            <CalendarIcon size={18} className="text-primary" />
            <span className="text-sm font-bold text-on-surface">{weekLabel}</span>
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-red-500">***Chú ý: Các ca màu đỏ là các ca có giáo viên bị trùng lịch dạy***</h2>
      </div>

      {/* Weekly Grid */}
      <WeeklySchedule scheduleData={scheduleData} startDate={start} onRefresh={refetch} />

      {/* Week Picker Modal */}
      <WeekPickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(newDate) => setCurrentDate(newDate)}
        initialDate={currentDate}
      />
    </div>
  );
};

export default Dashboard;
