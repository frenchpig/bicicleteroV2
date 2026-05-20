'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { cn } from '@app/ui';

interface ToastState {
  message: string;
  visible: boolean;
}

interface AdminToastContextValue {
  showSuccess: (message: string) => void;
}

const AdminToastContext = createContext<AdminToastContextValue | null>(null);

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false });

  const showSuccess = useCallback((message: string) => {
    setToast({ message, visible: true });
    window.setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  const value = useMemo(() => ({ showSuccess }), [showSuccess]);

  return (
    <AdminToastContext.Provider value={value}>
      {children}
      {toast.visible && (
        <div
          role="status"
          className={cn(
            'fixed bottom-6 right-6 z-[1070] flex max-w-sm items-start gap-3 rounded-lg border border-green-300',
            'bg-green-50 p-4 shadow-lg dark:border-green-800 dark:bg-green-950',
          )}
        >
          <CheckCircle className="size-5 shrink-0 text-green-700 dark:text-green-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">Éxito</p>
            <p className="text-sm text-green-700 dark:text-green-300">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setToast((t) => ({ ...t, visible: false }))}
            className="text-green-700 hover:text-green-900 dark:text-green-400"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </AdminToastContext.Provider>
  );
}

export function useAdminToast() {
  const ctx = useContext(AdminToastContext);
  if (!ctx) {
    throw new Error('useAdminToast debe usarse dentro de AdminToastProvider');
  }
  return ctx;
}
