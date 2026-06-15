import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full px-4 md:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 flex-shrink-0" />
  };

  const borderColors = {
    success: 'border-emerald-500/20 dark:border-emerald-500/30',
    error: 'border-rose-500/20 dark:border-rose-500/30',
    info: 'border-indigo-500/20 dark:border-indigo-500/30'
  };

  const bgGlow = {
    success: 'shadow-emerald-500/5',
    error: 'shadow-rose-500/5',
    info: 'shadow-indigo-500/5'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }}
      className={`glass-panel border flex items-center justify-between p-4 rounded-xl shadow-lg ${borderColors[toast.type]} ${bgGlow[toast.type]} backdrop-blur-md`}
    >
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <p className="text-sm font-medium text-foreground leading-relaxed">
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="ml-4 p-1 rounded-lg hover:bg-foreground/5 dark:hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors duration-200"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
