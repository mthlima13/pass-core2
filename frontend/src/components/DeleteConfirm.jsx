import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirm({ open, onClose, onConfirm, title, description, loading }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal--sm">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={22} color="var(--danger)" />
            <h2>{title || 'Confirmar exclusão'}</h2>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-form">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {description || 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.'}
          </p>

          <div className="modal-actions">
            <button className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn-danger" onClick={onConfirm} disabled={loading}>
              {loading ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
