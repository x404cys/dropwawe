'use client';

import { useEffect } from 'react';
import { X, CheckCircle2, Info, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  type?: ToastType;
  message: string;
  description?: string;
  onClose: () => void;
  duration?: number;
}

const toastConfig = {
  success: {
    icon: <CheckCircle2 className="size-6 text-green-600" />,
    border: 'border-green-200',
  },
  error: {
    icon: <AlertCircle className="size-6 text-red-600" />,
    border: 'border-red-200',
  },
  info: {
    icon: <Info className="size-6 text-blue-600" />,
    border: 'border-blue-200',
  },
};

export default function Toast({
  type = 'info',
  message,
  description,
  onClose,
  duration = 8000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = toastConfig[type];

  return (
    <div
      role="alert"
      className={`animate-slide-in fixed bottom-10 left-1/2 z-50 max-w-sm -translate-x-1/2 rounded-md border bg-white p-4 shadow-sm transition-all ${config.border}`}
    >
      <div className="flex items-start gap-4">
        {config.icon}
        <div className="flex-1">
          <strong className="font-medium text-gray-900">{message}</strong>
          {description && <p className="mt-0.5 text-sm text-gray-700">{description}</p>}
        </div>
        <button
          onClick={onClose}
          className="-m-3 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
          type="button"
          aria-label="Dismiss alert"
        >
          <span className="sr-only">Dismiss popup</span>
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
}
