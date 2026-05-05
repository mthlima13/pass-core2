import { useApp } from '../context/AppContext';

export function useToast() {
  const { addToast, removeToast, toasts } = useApp();
  return { addToast, removeToast, toasts };
}
