import { useState, useEffect } from 'react';
import { scheduleService } from '@/services/schedule.service';

interface TargetCell {
  khoi: string;
  isoDate: string;
  displayDate: string;
  droppedTime?: {
    start: string;
    end: string;
  };
}

export const useAddSession = (
  isOpen: boolean,
  targetCell: TargetCell | null,
  onSuccess: () => void,
  editingSession: any = null
) => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loadingForm, setLoadingForm] = useState(true);

  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States for inline creating shift
  const [isCreatingShift, setIsCreatingShift] = useState(false);
  const [newShiftName, setNewShiftName] = useState('');
  const [newShiftStart, setNewShiftStart] = useState('');
  const [newShiftEnd, setNewShiftEnd] = useState('');
  const [creatingShift, setCreatingShift] = useState(false);

  useEffect(() => {
    if (isOpen && targetCell) {
      setLoadingForm(true);
      setError(null);

      if (editingSession) {
        setSelectedTeacher(editingSession.teacher_pk?.toString() || '');
        setSelectedClass(editingSession.class_id?.toString() || '');
        
        if (targetCell.droppedTime) {
          setIsCreatingShift(true);
          setNewShiftStart(targetCell.droppedTime.start);
          setNewShiftEnd(targetCell.droppedTime.end);
          setNewShiftName('');
          setSelectedShift('');
        } else {
          setSelectedShift(editingSession.shift_id?.toString() || '');
          setIsCreatingShift(false);
          setNewShiftName('');
          setNewShiftStart('');
          setNewShiftEnd('');
        }
      } else {
        setSelectedTeacher('');
        setSelectedClass('');
        setSelectedShift('');
        setIsCreatingShift(false);
        setNewShiftName('');
        setNewShiftStart('');
        setNewShiftEnd('');
      }

      const fetchOptions = async () => {
        try {
          const khoiNumber = targetCell.khoi.replace('Khối ', '');
          const [teacherData, shiftData, classData] = await Promise.all([
            scheduleService.fetchTeachers(),
            scheduleService.fetchShifts(),
            scheduleService.fetchClasses(khoiNumber, 1)
          ]);

          setTeachers(Array.isArray(teacherData) ? teacherData : (teacherData.results || []));
          setShifts(Array.isArray(shiftData) ? shiftData : (shiftData.results || []));
          setClasses(Array.isArray(classData) ? classData : (classData.results || []));
          setLoadingForm(false);
        } catch (err: any) {
          setError(err.message || "Failed to load form options");
          setLoadingForm(false);
        }
      };

      fetchOptions();
    }
  }, [isOpen, targetCell]);

  const handleCreateShift = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedClass || !newShiftName || !newShiftStart || !newShiftEnd) return;

    setCreatingShift(true);
    setError(null);

    try {
      const shiftData = {
        lop: parseInt(selectedClass),
        ten_ca: newShiftName,
        gio_bat_dau: newShiftStart,
        gio_ket_thuc: newShiftEnd
      };

      const newShift = await scheduleService.createShift(shiftData);
      
      setShifts(prev => [...prev, newShift]);
      setSelectedShift(newShift.id.toString());
      
      setIsCreatingShift(false);
      setNewShiftName('');
      setNewShiftStart('');
      setNewShiftEnd('');
      setCreatingShift(false);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tạo ca dạy mới');
      setCreatingShift(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedTeacher || !targetCell) return;
    if (!isCreatingShift && !selectedShift) return;

    setSubmitting(true);
    setError(null);

    try {
      let finalShiftId = selectedShift;

      if (isCreatingShift) {
        if (!selectedClass || !newShiftName || !newShiftStart || !newShiftEnd) {
           setError("Vui lòng điền đầy đủ thông tin Môn học / Ca dạy mới");
           setSubmitting(false);
           return;
        }
        
        const shiftData = {
          lop: parseInt(selectedClass),
          ten_ca: newShiftName,
          gio_bat_dau: newShiftStart,
          gio_ket_thuc: newShiftEnd
        };

        const newShift = await scheduleService.createShift(shiftData);
        finalShiftId = newShift.id.toString();
        // Update states silently so UI remains consistent
        setShifts(prev => [...prev, newShift]);
        setSelectedShift(finalShiftId);
      }

      if (editingSession) {
        await scheduleService.updateSession(editingSession.id, {
          giao_vien: parseInt(selectedTeacher),
          ca_day: parseInt(finalShiftId),
          ngay_day: targetCell.isoDate,
        });
      } else {
        await scheduleService.createSession({
          giao_vien: parseInt(selectedTeacher),
          ca_day: parseInt(finalShiftId),
          ngay_day: targetCell.isoDate,
        });
      }

      setSubmitting(false);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Lỗi hệ thống khi lưu lịch');
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingSession) return;

    setSubmitting(true);
    setError(null);

    try {
      await scheduleService.deleteSession(editingSession.id);
      setSubmitting(false);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi xóa ca dạy');
      setSubmitting(false);
    }
  };

  return {
    teachers,
    shifts,
    classes,
    loadingForm,
    selectedTeacher,
    setSelectedTeacher,
    selectedClass,
    setSelectedClass,
    selectedShift,
    setSelectedShift,
    submitting,
    error,
    handleSubmit,
    handleDelete,
    isCreatingShift,
    setIsCreatingShift,
    newShiftName,
    setNewShiftName,
    newShiftStart,
    setNewShiftStart,
    newShiftEnd,
    setNewShiftEnd,
    creatingShift,
    handleCreateShift
  };
};
