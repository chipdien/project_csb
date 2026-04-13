import React from 'react';
import { X, Clock, MapPin, User as UserIcon, BookOpen } from 'lucide-react';
import Tooltip from '@/components/Tooltip';

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
  onClick?: (e: React.MouseEvent) => void;
  subject?: string;
  classNameFull?: string;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
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
  style,
  onClick,
  subject,
  classNameFull,
  draggable = false,
  onDragStart
}) => {
  const variantClasses = {
    primary: isConflict ? 'border-red-500 bg-red-100 shadow-red-100/50' : 'border-primary text-on-surface bg-white',
    secondary: isConflict ? 'border-red-500 bg-red-100 shadow-red-100/50' : 'border-secondary/60 text-on-surface bg-white',
  };

  const roomColorClasses = {
    primary: isConflict ? 'text-red-600' : 'text-primary',
    secondary: isConflict ? 'text-red-600' : 'text-secondary',
  };

  const cardContent = (
    <div 
      id={id}
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick(e);
        }
      }}
      className={`px-2 py-2 rounded shadow-sm border-l-2 group transition-all duration-300 min-h-[40px] ${
        isTimelineMode ? 'absolute flex flex-col justify-between' : 'relative'
      } ${variantClasses[variant]} ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''} ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
      style={style}
    >
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold tracking-wider opacity-90 group-hover:opacity-100">{code}</span>
        {isConflict && (
          <X size={10} className="text-red-600 bg-red-100 rounded-full" />
        )}
      </div>
      
      <div className="mt-0.5 flex flex-col gap-0.5">
        <div className="flex items-center gap-1">
          <Clock size={10} className="opacity-50" />
          <span className="text-[9px] font-medium opacity-80">{time}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin size={10} className={roomColorClasses[variant]} />
          <span className={`text-[9px] font-bold ${roomColorClasses[variant]}`}>{room}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Tooltip
      content={
        <div className="space-y-3 p-1">
          <div className="border-b border-white/10 pb-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen size={14} className="text-blue-400" />
              {classNameFull || code}
            </h4>
            {subject && <p className="text-[11px] text-slate-300 mt-0.5 font-medium">{subject}</p>}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <UserIcon size={12} className="text-slate-400" />
              <span className="text-slate-200">Giáo viên: <span className="text-white font-medium">{teacherName || 'Chưa phân công'}</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Clock size={12} className="text-slate-400" />
              <span className="text-slate-200">Giờ học: <span className="text-white font-medium">{time}</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <MapPin size={12} className="text-slate-400" />
              <span className="text-slate-200">Phòng: <span className="text-white font-medium">{room}</span></span>
            </div>
          </div>
          
          {isConflict && (
            <div className="pt-2 border-t border-white/10">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Phát hiện trùng lịch</p>
            </div>
          )}
        </div>
      }
    >
      {cardContent}
    </Tooltip>
  );
};

export default ScheduleCard;
