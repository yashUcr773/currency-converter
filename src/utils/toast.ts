export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

const toasts: Toast[] = [];
const listeners: ((toasts: Toast[]) => void)[] = [];

function notifyListeners() {
  listeners.forEach(listener => listener([...toasts]));
}

export const toast = {
  success: (title: string, message?: string, duration = 5000) => {
    const id = Date.now().toString();
    toasts.push({ id, type: 'success', title, message, duration });
    notifyListeners();
    return id;
  },
  error: (title: string, message?: string, duration = 8000) => {
    const id = Date.now().toString();
    toasts.push({ id, type: 'error', title, message, duration });
    notifyListeners();
    return id;
  },
  warning: (title: string, message?: string, duration = 6000) => {
    const id = Date.now().toString();
    toasts.push({ id, type: 'warning', title, message, duration });
    notifyListeners();
    return id;
  },
  info: (title: string, message?: string, duration = 5000) => {
    const id = Date.now().toString();
    toasts.push({ id, type: 'info', title, message, duration });
    notifyListeners();
    return id;
  },
  dismiss: (id: string) => {
    const index = toasts.findIndex(toast => toast.id === id);
    if (index > -1) {
      toasts.splice(index, 1);
      notifyListeners();
    }
  }
};

export function useToasts() {
  return { listeners, toasts: [...toasts] };
}
