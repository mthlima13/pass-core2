import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ICONS = ['folder', 'briefcase', 'tv', 'users', 'landmark', 'gamepad', 'book', 'globe', 'heart', 'lock'];

export default function CategoryModal({ open, onClose, onSave, category }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('folder');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = Boolean(category);

  useEffect(() => {
    if (open) {
      setName(category?.name || '');
      setIcon(category?.icon || 'folder');
      setError('');
    }
  }, [open, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }
    setSaving(true);
    const ok = await onSave({ name: name.trim(), icon });
    setSaving(false);
    if (ok) onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal--sm">
        <div className="modal-header">
          <h2>{isEdit ? 'Editar Categoria' : 'Nova Categoria'}</h2>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className={`form-field ${error ? 'error' : ''}`}>
            <label>Nome *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="ex: Trabalho, Streaming, Bancos..."
              autoFocus
            />
            {error && <span className="field-error">{error}</span>}
          </div>

          <div className="form-field">
            <label>Ícone</label>
            <div className="icon-grid">
              {ICONS.map(ic => (
                <button
                  key={ic}
                  type="button"
                  className={`icon-option ${icon === ic ? 'selected' : ''}`}
                  onClick={() => setIcon(ic)}
                  title={ic}
                >
                  {ic.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Salvando...' : isEdit ? 'Salvar' : 'Criar Categoria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
