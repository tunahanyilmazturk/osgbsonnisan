import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ type, message, onClose, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    error: <XCircle className="text-rose-500" size={20} />,
    warning: <AlertCircle className="text-amber-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  const colors = {
    success: 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10',
    error: 'border-rose-200 bg-rose-50 dark:border-rose-500/20 dark:bg-rose-500/10',
    warning: 'border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10',
    info: 'border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/10',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${colors[type]}`}
        >
          {icons[type]}
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{message}</p>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; type: ToastType; message: string }>;
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
