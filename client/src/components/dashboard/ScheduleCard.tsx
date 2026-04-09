import React from 'react';
import { Timer, User } from 'lucide-react';

interface ScheduleCardProps {
  id?: string;
  code: string;
  time: string;
  room: string;
  teacherName?: string;
  isConflict?: boolean;
  variant?: 'primary' | 'secondary';
  isTimelineMode?: boolean;
  style?: React.CSSProperties;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ 
  id,
  code, 
  time, 
  room, 
  teacherName,
  isConflict = false,
  variant = 'primary',
  isTimelineMode = false,
  style
}) => {
  const variantClasses = {
    primary: isConflict ? 'border-red-500 bg-red-100 shadow-red-100/50' : 'border-primary text-on-surface bg-white',
    secondary: isConflict ? 'border-red-500 bg-red-100 shadow-red-100/50' : 'border-secondary/60 text-on-surface bg-white',
  };

  const roomColorClasses = {
    primary: isConflict ? 'text-red-600' : 'text-primary',
    secondary: isConflict ? 'text-red-600' : 'text-secondary',
  };

  return (
    <div 
      id={id}
      className={`px-2 py-2 rounded shadow-sm border-l-2 group cursor-pointer hover:shadow-md transition-all duration-300 min-h-[40px] ${
        isTimelineMode ? 'absolute flex flex-col justify-between' : 'relative'
      } ${variantClasses[variant]}`}
      style={style}
    >
      <div className="flex justify-between items-start">
        <h4 className={`font-bold leading-tight ${isTimelineMode ? 'text-[11px]' : 'text-[10px]'} ${isConflict ? 'text-red-700' : ''}`}>
          {code}
        </h4>
        {isConflict && !isTimelineMode && (
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        )}
      </div>

      <div className="flex justify-between items-end mt-1">
        <div className="flex flex-col gap-0.5">
          <span className={`text-[9px] flex items-center gap-0.5 ${isConflict ? 'text-red-500/70' : 'text-outline'} ${isTimelineMode ? '' : 'hidden xl:flex'}`}>
            <Timer size={10} /> {time}
          </span>
          {isTimelineMode && teacherName && (
            <span className={`text-[9px] font-medium flex items-center gap-0.5 ${isConflict ? 'text-red-600' : 'text-primary/70'}`}>
              <User size={10} /> GV: {teacherName}
            </span>
          )}
        </div>
        <span className={`text-[9px] font-bold ${roomColorClasses[variant]}`}>{room}</span>
      </div>
    </div>
  );
};

export default ScheduleCard;
