import React, { useState } from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';

interface WeekPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (d: Date) => void;
  initialDate: Date;
}

const WeekPickerModal: React.FC<WeekPickerModalProps> = ({ isOpen, onClose, onSelect, initialDate }) => {
  if (!isOpen) return null;
  const [year, setYear] = useState(initialDate.getFullYear());
  const [month, setMonth] = useState(initialDate.getMonth());

  const getWeeksInMonth = (y: number, m: number) => {
    let currentMonday = new Date(y, m, 1);
    const fDay = currentMonday.getDay();
    currentMonday.setDate(currentMonday.getDate() - fDay + (fDay === 0 ? -6 : 1));

    const weeks = [];
    while (true) {
      const wStart = new Date(currentMonday);
      const wEnd = new Date(wStart);
      wEnd.setDate(wStart.getDate() + 6);
      
      weeks.push({
        start: new Date(wStart),
        end: new Date(wEnd),
        label: `${String(wStart.getDate()).padStart(2, '0')}/${String(wStart.getMonth()+1).padStart(2, '0')} - ${String(wEnd.getDate()).padStart(2, '0')}/${String(wEnd.getMonth()+1).padStart(2, '0')}`
      });

      currentMonday.setDate(currentMonday.getDate() + 7);
      if (currentMonday.getFullYear() > y || (currentMonday.getFullYear() === y && currentMonday.getMonth() > m)) {
        break;
      }
    }
    return weeks;
  };

  const weeks = getWeeksInMonth(year, month);
  const monthNames = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-outline-variant/30 bg-slate-50 flex justify-between items-center">
           <h3 className="font-bold text-lg text-on-surface">Chọn Tuần Lịch Dạy</h3>
           <button onClick={onClose} className="p-1 text-outline-variant hover:text-on-surface hover:bg-slate-200 rounded-full transition-colors">
              <X size={20} />
           </button>
        </div>
        <div className="p-5 space-y-4">
           <div className="flex gap-2">
             <select 
                value={month} 
                onChange={e => setMonth(Number(e.target.value))} 
                className="flex-1 px-3 py-2 border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none text-on-surface font-medium"
             >
               {monthNames.map((mName, i) => <option key={i} value={i}>{mName}</option>)}
             </select>
             <input 
                type="number" 
                value={year} 
                onChange={e => setYear(Number(e.target.value))} 
                className="w-24 px-3 py-2 border border-outline-variant/50 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none text-on-surface font-medium" 
             />
           </div>
           
           <div className="space-y-2 mt-4 max-h-[350px] overflow-y-auto pr-1">
             {weeks.map((w, i) => (
                <button 
                  key={i} 
                  onClick={() => { onSelect(w.start); onClose(); }}
                  className="w-full flex items-center justify-between px-4 py-3 border border-outline-variant/40 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left group"
                >
                  <div>
                    <div className="font-bold text-primary text-sm">Tuần {i + 1}</div>
                    <div className="text-outline text-xs mt-0.5">{w.label}</div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <CalendarIcon size={12} className={i === 0 ? "text-primary" : "text-outline-variant"} />
                  </div>
                </button>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default WeekPickerModal;
