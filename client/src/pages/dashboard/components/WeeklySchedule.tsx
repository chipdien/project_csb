import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, Plus } from 'lucide-react';
import ScheduleCard from './ScheduleCard';
import AddSessionModal from './AddSessionModal';
import { calculateTimelinePosition, detectConflicts, generateTimeRuler, getScheduleLayers, getWeekDays } from '@/utils/timeUtils';

export interface WeeklyScheduleProps {
  scheduleData: any;
  startDate: string;
  onRefresh?: () => void;
}

const CARD_HEIGHT = 62;
const GAP = 8;
const ROW_PADDING = 16;
const ALL_KHOI = [6, 7, 8, 9, 10, 11, 12].map(num => `Khối ${num}`);

const TIMELINE_START = 7;
const TIMELINE_END = 21;

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ scheduleData, startDate, onRefresh }) => {
  const days = getWeekDays(startDate);
  const timeRuler = generateTimeRuler(TIMELINE_START, TIMELINE_END);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetCell, setTargetCell] = useState<{ khoi: string; isoDate: string; displayDate: string; droppedTime?: { start: string, end: string } } | null>(null);
  const [editingSession, setEditingSession] = useState<any>(null);
  const [dragIndicatorPercent, setDragIndicatorPercent] = useState<number | null>(null);
  const [dragOffsetX, setDragOffsetX] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<{title: string, message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (title: string, message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ title, message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const toggleDay = (key: string) => {
    setSelectedDayKey(prev => prev === key ? null : key);
  };

  const isTimelineMode = selectedDayKey !== null;

  // 1. Phân tích xung đột toàn tuần để hiển thị icon cảnh báo ở Header
  const dayConflictsMap = days.reduce((acc, day) => {
    const allSessionsInDay: any[] = [];
    scheduleData.data.forEach((grade: any) => {
      const sessions = (grade.schedule as any)[day.key] || [];
      sessions.forEach((s: any) => allSessionsInDay.push({ ...s, khoi: grade.khoi }));
    });

    const conflicts = detectConflicts(allSessionsInDay).filter(s => s.isConflict);
    acc[day.key] = conflicts;
    return acc;
  }, {} as Record<string, any[]>);

  // 2. Lấy danh sách xung đột chi tiết cho ngày đang chọn để hiển thị Banner
  const currentDayConflicts = selectedDayKey ? dayConflictsMap[selectedDayKey] : [];

  // Group conflicts by teacher to show in banner
  const conflictGroups = currentDayConflicts.reduce((acc, s) => {
    if (!acc[s.teacher_id]) acc[s.teacher_id] = { name: s.teacher_name, sessions: [] };
    acc[s.teacher_id].sessions.push(s);
    return acc;
  }, {} as Record<string, any>);

  const scrollToConflict = (gradeName: string) => {
    const element = document.getElementById(`row-${gradeName}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('bg-red-50');
      setTimeout(() => element.classList.remove('bg-red-50'), 2000);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIsoDate: string, targetKhoi: string, targetDisplayDate: string, isTimelineDrop: boolean = false) => {
    e.preventDefault();
    const sessionStr = e.dataTransfer.getData('application/json');
    if (!sessionStr) return;
    
    try {
      const session = JSON.parse(sessionStr);
      let droppedTime: { start: string, end: string } | undefined = undefined;
      
      if (isTimelineDrop) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        // Mouse coordinate relative to the timeline track LESS the pointer offset inside the card
        const x = e.clientX - rect.left - dragOffsetX;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        
        const totalMinutes = (TIMELINE_END - TIMELINE_START) * 60;
        const startMinutes = TIMELINE_START * 60 + (percentage * totalMinutes);
        
        // Snap to nearest 15 minutes
        const snappedStartMinutes = Math.round(startMinutes / 15) * 15;
        
        const sHours = Math.floor(snappedStartMinutes / 60);
        const sMins = snappedStartMinutes % 60;
        const startStr = `${String(sHours).padStart(2, '0')}:${String(sMins).padStart(2, '0')}`;
        
        // Use dragged duration or 90 mins
        let durationMins = 90;
        if (session.time && session.time.includes('-')) {
          const [origStart, origEnd] = session.time.split(' - ');
          if (origStart && origEnd) {
            const [osH, osM] = origStart.split(':').map(Number);
            const [oeH, oeM] = origEnd.split(':').map(Number);
            const calculatedDuration = (oeH * 60 + oeM) - (osH * 60 + osM);
            if (calculatedDuration > 0) durationMins = calculatedDuration;
          }
        }
        
        const endMinutes = snappedStartMinutes + durationMins;
        const eHours = Math.floor(endMinutes / 60);
        const eMins = endMinutes % 60;
        const endStr = `${String(eHours).padStart(2, '0')}:${String(eMins).padStart(2, '0')}`;
        
        droppedTime = { start: startStr, end: endStr };
      }

      setEditingSession(session);
      setTargetCell({ khoi: targetKhoi, isoDate: targetIsoDate, displayDate: targetDisplayDate, droppedTime });
      setIsModalOpen(true);
    } catch (err) {
      console.error('Failed to parse dropped session data', err);
    }
  };


  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-outline-variant/80 transition-all duration-500 ease-in-out relative group/schedule">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-[9999] p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 min-w-[300px] ${toastMessage.type === 'success' ? 'bg-[#F2FDF5] border-[#BBF7D0] text-[#166534]' : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'}`}>
          <div className={`p-1.5 rounded-full text-white ${toastMessage.type === 'success' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`}>
            <AlertTriangle size={18} />
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-wide">{toastMessage.title}</h4>
            <p className="text-xs font-medium opacity-80 mt-0.5">{toastMessage.message}</p>
          </div>
        </div>
      )}

      {/* Global Drag Indicator */}
      {isTimelineMode && dragIndicatorPercent !== null && (
        <div 
          className="absolute top-0 bottom-0 border-l-[2px] border-primary border-dashed z-[100] pointer-events-none transition-none shadow-[0_0_10px_rgba(var(--primary),0.3)]"
          style={{ left: `calc(120px + (100% - 120px) * ${dragIndicatorPercent})` }}
        >
          <div className="absolute top-2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
            {(() => {
              const m = TIMELINE_START * 60 + dragIndicatorPercent * ((TIMELINE_END - TIMELINE_START) * 60);
              const r = Math.round(m / 15) * 15;
              return `${String(Math.floor(r/60)).padStart(2,'0')}:${String(r%60).padStart(2,'0')}`;
            })()}
          </div>
        </div>
      )}

      {/* Grid Header */}
      <div className={`grid border-b border-outline-variant/80 bg-slate-50 transition-all duration-500 ${isTimelineMode ? 'grid-cols-[120px_1fr]' : 'grid-cols-[120px_repeat(7,1fr)]'
        }`}>
        <div className="p-4 flex items-center justify-center bg-white border-r border-outline-variant/10">
          {isTimelineMode ? (
            <button
              onClick={() => setSelectedDayKey(null)}
              className="flex items-center gap-2 text-primary hover:bg-primary/5 px-2 py-1 rounded transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="text-xs font-bold uppercase cursor-pointer">Back</span>
            </button>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-sm font-black uppercase tracking-[0.1em] text-outline leading-none">Khối</span>
              <div className="h-px w-8 bg-outline-variant/30 my-1" />
              <span className="text-sm font-black uppercase tracking-[0.1em] text-outline leading-none">Ngày</span>
            </div>
          )}
        </div>

        {/* headers */}
        {!isTimelineMode ? (
          days.map((day) => (
            <div
              key={day.name}
              onClick={() => toggleDay(day.key)}
              className="p-4 flex items-center justify-center group border-l border-outline-variant/80 cursor-pointer hover:bg-primary/[0.02] transition-colors relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex flex-col items-center justify-center gap-1 mb-1">
                    <span className={`block text-[11px] font-bold text-primary uppercase tracking-wider`}>
                      {day.name}
                    </span>
                    <span className="text-[10px] text-outline-variant font-medium mt-0.5">
                      {day.dateFormatted}
                    </span>
                    {dayConflictsMap[day.key]?.length > 0 && (
                      <AlertTriangle size={12} className="text-red-500 animate-bounce" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex relative h-full">
            {/* Thanh thước đo thời gian */}
            <div className="flex w-full relative overflow-visible">
              {timeRuler.map((time, idx) => {
                const position = (idx / (timeRuler.length - 1)) * 100;
                return (
                  <div
                    key={time}
                    className="absolute top-0 bottom-0 flex flex-col items-center justify-end pb-2 -translate-x-1/2"
                    style={{ left: `${position}%` }}
                  >
                    <span className="text-[10px] font-bold text-outline uppercase whitespace-nowrap">{time}</span>
                  </div>
                );
              })}
            </div>
            {/* Header của ngày được chọn */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white px-4 py-0.5 rounded-full border border-primary shadow-sm z-10">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                {days.find(d => d.key === selectedDayKey)?.name} Focus
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Conflict Alert Banner */}
      {isTimelineMode && currentDayConflicts.length > 0 && (
        <div className="bg-red-50 border-b border-red-200 p-3 animate-in fade-in slide-in-from-top duration-500">
          <div className="flex items-start gap-3">
            <div className="bg-red-500 p-1.5 rounded-full mt-0.5">
              <AlertTriangle size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-700 uppercase tracking-wide">Cảnh báo: Phát hiện trùng lịch giảng dạy</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(conflictGroups).map(([teacherId, group]: [string, any]) => (
                  <div key={teacherId} className="bg-white/80 border border-red-200 rounded px-2 py-1 flex items-center gap-2 shadow-sm">
                    <span className="text-[11px] font-bold text-red-800">GV: {group.name}</span>
                    <div className="flex gap-1">
                      {group.sessions.map((s: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => scrollToConflict(s.grade_name)}
                          className="text-[10px] bg-red-100 hover:bg-red-200 text-red-700 px-1.5 py-0.5 rounded transition-colors font-medium"
                        >
                          {s.grade_name} ({s.time})
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Rows */}
      <div className="divide-y divide-outline-variant/50">
        {ALL_KHOI.map((khoiName) => {
          // Tìm dữ liệu khối trong mảng data từ backend, nếu không có thì dùng object rỗng
          const gradeItem = scheduleData?.data?.find((g: any) => g.khoi === khoiName) || {
            khoi: khoiName,
            schedule: {}
          };

          const rawSessions = isTimelineMode ? ((gradeItem.schedule as any)[selectedDayKey!] || []) : [];

          // 4. Gán isConflict cho từng session dựa trên danh sách xung đột toàn cục đã tính ở trên
          const sessionsWithGlobalConflict = rawSessions.map((s: any) => {
            const hasConflict = currentDayConflicts.some((c: any) =>
              c.code === s.code && c.time === s.time && c.teacher_id === s.teacher_id
            );
            return { ...s, isConflict: hasConflict };
          });

          const layeredSessions = isTimelineMode ? getScheduleLayers(sessionsWithGlobalConflict) : [];
          const maxLayer = layeredSessions.length > 0 ? Math.max(...layeredSessions.map(s => s.layerIndex)) : 0;
          const dynamicRowHeight = isTimelineMode ? (maxLayer + 1) * (CARD_HEIGHT + GAP) + ROW_PADDING : undefined;

          return (
            <div
              key={gradeItem.khoi}
              id={`row-${gradeItem.khoi}`}
              className={`grid transition-all duration-500 overflow-hidden ${isTimelineMode ? 'grid-cols-[120px_1fr]' : 'grid-cols-[120px_repeat(7,1fr)] min-h-[140px]'
                } bg-slate-50`}
              style={isTimelineMode ? { height: dynamicRowHeight } : {}}
            >
              <div className="p-4 flex flex-col items-center justify-center border-r border-outline-variant/10 bg-white">
                <span className="text-xl font-extrabold text-on-surface uppercase tracking-tight">{gradeItem.khoi}</span>
              </div>

              {/* Rendering cells */}
              {!isTimelineMode ? (
                days.map((day) => {
                  const sessions = (gradeItem.schedule as any)[day.key] || [];
                  return (
                    <div
                      key={day.key}
                      className="p-2 space-y-2 border-l border-outline-variant/50 bg-white hover:bg-primary/[0.02] transition-colors overflow-y-auto relative group"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, day.isoDate, gradeItem.khoi, day.dateFormatted)}
                    >
                      {sessions.length > 0 ? (
                        <>
                          {sessions.map((session: any, sIdx: number) => {
                            const isConflict = dayConflictsMap[day.key]?.some((c: any) =>
                              c.code === session.code && c.time === session.time && c.teacher_id === session.teacher_id
                            );
                            return (
                              <ScheduleCard
                                key={sIdx}
                                code={session.code}
                                time={session.time}
                                room={session.room}
                                teacherName={session.teacher_name}
                                subject={session.subject}
                                classNameFull={session.class_name}
                                isConflict={isConflict}
                                variant={sIdx % 2 === 0 ? 'primary' : 'secondary'}
                                draggable={true}
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('application/json', JSON.stringify(session));
                                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                  setDragOffsetX(e.clientX - rect.left);
                                }}
                                onClick={() => {
                                  setEditingSession(session);
                                  setTargetCell({ khoi: gradeItem.khoi, isoDate: day.isoDate, displayDate: day.dateFormatted });
                                  setIsModalOpen(true);
                                }}
                              />
                            );
                          })}
                          {/* Ghost Card for existing sessions */}
                          <div
                            onClick={() => {
                              setEditingSession(null);
                              setTargetCell({ khoi: gradeItem.khoi, isoDate: day.isoDate, displayDate: day.dateFormatted });
                              setIsModalOpen(true);
                            }}
                            className="hidden group-hover:flex items-center justify-center gap-2 px-2 py-3 rounded border-2 border-dashed border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer animate-in fade-in slide-in-from-top-1 duration-200"
                          >
                            <Plus size={14} strokeWidth={3} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Thêm ca dạy</span>
                          </div>
                        </>
                      ) : (
                        <div 
                          className="relative h-full flex flex-col items-center justify-center min-h-[100px] cursor-pointer"
                          onClick={() => {
                            setEditingSession(null);
                            setTargetCell({ khoi: gradeItem.khoi, isoDate: day.isoDate, displayDate: day.dateFormatted });
                            setIsModalOpen(true);
                          }}
                        >
                          <div className="flex items-center justify-center opacity-20">
                            <span className="text-[8px] font-bold text-outline-variant uppercase tracking-widest">N/A</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div 
                  className="relative w-full bg-white transition-all duration-500 min-h-[100px]"
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (isTimelineMode) {
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      const x = e.clientX - rect.left - dragOffsetX;
                      setDragIndicatorPercent(Math.max(0, Math.min(1, x / rect.width)));
                    }
                  }}
                  onDragLeave={() => setDragIndicatorPercent(null)}
                  onDrop={(e) => {
                    setDragIndicatorPercent(null);
                    const targetedDay = days.find(d => d.key === selectedDayKey);
                    if (targetedDay) {
                      handleDrop(e, targetedDay.isoDate, gradeItem.khoi, targetedDay.dateFormatted, true);
                    }
                  }}
                >
                  {/* Lưới nền cho timeline */}
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: TIMELINE_END - TIMELINE_START + 1 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="absolute top-0 bottom-0 border-l border-outline-variant/30"
                        style={{ left: `${(idx / (TIMELINE_END - TIMELINE_START)) * 100}%` }}
                      />
                    ))}
                  </div>

                  {/* Dữ liệu ca dạy */}
                  <div className="relative h-full">
                    {layeredSessions.map((session: any, sIdx: number) => {
                      const pos = calculateTimelinePosition(session.time, TIMELINE_START, TIMELINE_END);
                      const top = session.layerIndex * (CARD_HEIGHT + GAP) + (ROW_PADDING / 2);

                      return (
                        <ScheduleCard
                          key={sIdx}
                          code={session.code}
                          time={session.time}
                          room={session.room}
                          teacherName={session.teacher_name}
                          subject={session.subject}
                          classNameFull={session.class_name}
                          isConflict={session.isConflict}
                          isTimelineMode={true}
                          variant={sIdx % 2 === 0 ? 'primary' : 'secondary'}
                          draggable={true}
                          onDragStart={(e) => {
                            e.dataTransfer.setData('application/json', JSON.stringify(session));
                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                            setDragOffsetX(e.clientX - rect.left);
                          }}
                          onClick={() => {
                            setEditingSession(session);
                            setTargetCell({ khoi: gradeItem.khoi, isoDate: selectedDayKey!, displayDate: days.find(d => d.key === selectedDayKey)?.dateFormatted || '' });
                            setIsModalOpen(true);
                          }}
                          style={{
                            left: pos.left,
                            width: pos.width,
                            top: `${top}px`,
                            height: `${CARD_HEIGHT}px`
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AddSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetCell={targetCell}
        editingSession={editingSession}
        onSuccess={() => {
          setIsModalOpen(false);
          showToast('Cập nhật thành công', 'Ca dạy đã được lưu hệ thống!', 'success');
          // Gọi refresh data thay vì reload cứng trang
          if (onRefresh) {
            onRefresh();
          } else {
            setTimeout(() => window.location.reload(), 1500);
          }
        }}
      />
    </div>
  );
};

export default WeeklySchedule;
