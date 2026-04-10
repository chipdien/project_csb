import React from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { useAddSession } from '@/pages/dashboard/hooks/useAddSession';
import ConfirmModal from '@/components/ConfirmModal';

interface AddSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCell: { khoi: string; isoDate: string; displayDate: string } | null;
  onSuccess: () => void;
}

const AddSessionModal: React.FC<AddSessionModalProps> = ({ isOpen, onClose, targetCell, onSuccess }) => {
  const {
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
  } = useAddSession(isOpen, targetCell, onSuccess);

  const [showConfirm, setShowConfirm] = React.useState(false);

  // Reset confirm state when modal closes or opens
  React.useEffect(() => {
    if (!isOpen) setShowConfirm(false);
  }, [isOpen]);

  if (!isOpen) return null;

  if (showConfirm) {
    return (
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => handleSubmit()}
        title="Xác nhận lưu ca dạy"
        message="Bạn có chắc chắn muốn thêm ca dạy này không?"
        cancelText="Quay lại sửa"
        confirmText="Xác nhận Lưu"
        isLoading={submitting}
        error={error}
        type="warning"
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/30 bg-slate-50/50">
          <h2 className="text-xl font-bold text-on-surface">Thêm Ca Dạy Mới</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-outline-variant hover:text-on-surface hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {targetCell && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-6 flex gap-4">
              <div>
                <span className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">Ngày Dạy</span>
                <span className="font-medium text-primary">{targetCell.displayDate}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">Khối</span>
                <span className="font-medium text-primary">{targetCell.khoi}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {loadingForm ? (
            <div className="flex flex-col items-center justify-center py-8 text-outline">
              <Loader2 className="animate-spin mb-2" size={24} />
              <p className="text-sm">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setShowConfirm(true); }} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-1.5" htmlFor="class-select">Lớp</label>
                <select
                  id="class-select"
                  className="w-full bg-white border border-outline-variant/60 rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setSelectedShift('');
                  }}
                  required
                >
                  <option value="">-- Chọn lớp --</option>
                  {classes.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.ten_lop || c.ma_lop}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface mb-1.5" htmlFor="shift-select">Ca dạy</label>
                <select
                  id="shift-select"
                  className="w-full bg-white border border-outline-variant/60 rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  required
                  disabled={!selectedClass}
                >
                  <option value="">-- Chọn ca dạy --</option>
                  {shifts.filter((s: any) => s.lop === parseInt(selectedClass)).map((s: any) => (
                    <option key={s.id} value={s.id}>{s.ten_ca || s.name} {s.gio_bat_dau && s.gio_ket_thuc ? `(${s.gio_bat_dau} - ${s.gio_ket_thuc})` : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface mb-1.5" htmlFor="teacher-select">Giáo viên</label>
                <select
                  id="teacher-select"
                  className="w-full bg-white border border-outline-variant/60 rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  required
                >
                  <option value="">-- Chọn giáo viên --</option>
                  {teachers.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.ho_ten || t.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 min-h-[40px]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-sm font-medium text-on-surface bg-white border border-outline-variant/50 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedTeacher || !selectedClass || !selectedShift}
                  className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {submitting ? 'Đang tải...' : 'Lưu Ca Dạy'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSessionModal;
