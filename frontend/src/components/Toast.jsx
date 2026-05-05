import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ICONS = {
  success: <CheckCircle size={20} />,
  error: <XCircle size={20} />,
  info: <Info size={20} />,
};

function ToastItem({ toast, onRemove }) {
  return (
    <div className={`toast toast--${toast.type}`}>
      <span className="toast-icon">{ICONS[toast.type] || ICONS.info}</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={() => onRemove(toast.id)}>
        <X size={16} />
      </button>
    </div>
  );
}

export default function Toast({ toasts, onRemove }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}
