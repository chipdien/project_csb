import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  isLoading?: boolean;
  error?: string | null;
  type?: 'warning' | 'danger' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  cancelText = 'Hủy',
  confirmText = 'Xác nhận',
  isLoading = false,
  error = null,
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const getStyleByType = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          buttonBg: 'bg-red-600',
          buttonHover: 'hover:bg-red-700'
        };
      case 'info':
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          buttonBg: 'bg-primary',
          buttonHover: 'hover:bg-primary/90'
        };
      case 'warning':
      default:
        return {
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600',
          buttonBg: 'bg-primary',
          buttonHover: 'hover:bg-primary/90'
        };
    }
  };

  const styles = getStyleByType();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { if (!isLoading) onClose(); }} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className={`w-12 h-12 rounded-full ${styles.iconBg} ${styles.iconColor} flex items-center justify-center mx-auto mb-4`}>
            {type === 'danger' ? <AlertCircle size={24} /> : <AlertCircle size={24} />}
          </div>
          <h3 className="text-lg font-bold text-on-surface mb-2">{title}</h3>
          <p className="text-outline text-sm mb-6">{message}</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm italic text-left">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button 
              type="button" 
              disabled={isLoading}
              onClick={onClose} 
              className="px-5 py-2.5 text-sm font-medium text-on-surface bg-white border border-outline-variant/60 rounded-lg hover:bg-slate-50 transition-colors w-full"
            >
              {cancelText}
            </button>
            <button 
              type="button" 
              disabled={isLoading}
              onClick={onConfirm} 
              className={`px-5 py-2.5 text-sm font-medium text-white ${styles.buttonBg} rounded-lg ${styles.buttonHover} disabled:opacity-50 transition-colors flex items-center justify-center gap-2 w-full shadow-sm`}
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? 'Đang tải...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
