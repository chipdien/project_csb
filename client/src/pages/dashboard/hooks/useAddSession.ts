import { useState, useEffect } from 'react';
import { scheduleService } from '@/services/schedule.service';

interface TargetCell {
  khoi: string;
  isoDate: string;
  displayDate: string;
}

export const useAddSession = (
  isOpen: boolean,
  targetCell: TargetCell | null,
  onSuccess: () => void
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

  useEffect(() => {
    if (isOpen && targetCell) {
      setLoadingForm(true);
      setError(null);
      setSelectedTeacher('');
      setSelectedClass('');
      setSelectedShift('');

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedTeacher || !selectedShift || !targetCell) return;

    setSubmitting(true);
    setError(null);

    try {
      await scheduleService.createSession({
        giao_vien: parseInt(selectedTeacher),
        ca_day: parseInt(selectedShift),
        ngay_day: targetCell.isoDate,
      });

      setSubmitting(false);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Lỗi server');
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
    handleSubmit
  };
};
