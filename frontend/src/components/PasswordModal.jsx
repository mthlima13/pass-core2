import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Eye, EyeOff } from 'lucide-react';
import PasswordStrength from './PasswordStrength';
import { utilsService } from '../services/utilsService';

const INITIAL = {
  serviceName: '',
  url: '',
  username: '',
  password: '',
  categoryId: '',
  notes: '',
  favorite: false,
};

export default function PasswordModal({ open, onClose, onSave, entry, categories }) {
  const [form, setForm] = useState(INITIAL);
  const [showPassword, setShowPassword] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = Boolean(entry);

  useEffect(() => {
    if (open) {
      setForm(
        entry
          ? {
              serviceName: entry.serviceName || '',
              url: entry.url || '',
              username: entry.username || '',
              password: '',
              categoryId: entry.categoryId?._id || entry.categoryId || '',
              notes: entry.notes || '',
              favorite: entry.favorite || false,
            }
          : INITIAL
      );
      setErrors({});
      setShowPassword(false);
    }
  }, [open, entry]);

  const validate = () => {
    const e = {};
    if (!form.serviceName.trim()) e.serviceName = 'Nome do serviço é obrigatório';
    if (!form.username.trim()) e.username = 'Usuário/Email é obrigatório';
    if (!isEdit && !form.password.trim()) e.password = 'Senha é obrigatória';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const pwd = await utilsService.generatePassword({ length: 20, symbols: true, numbers: true, uppercase: true });
      setForm(prev => ({ ...prev, password: pwd }));
      setShowPassword(true);
    } catch {
      // silently fail, user can still type
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = { ...form };
    if (!payload.categoryId) delete payload.categoryId;
    if (isEdit && !payload.password) delete payload.password;
    const ok = await onSave(payload);
    setSaving(false);
    if (ok) onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? 'Editar Senha' : 'Nova Senha'}</h2>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className={`form-field ${errors.serviceName ? 'error' : ''}`}>
            <label>Nome do Serviço *</label>
            <input type="text" value={form.serviceName} onChange={handleChange('serviceName')} placeholder="ex: GitHub, Netflix..." />
            {errors.serviceName && <span className="field-error">{errors.serviceName}</span>}
          </div>

          <div className="form-field">
            <label>URL / Site</label>
            <input type="text" value={form.url} onChange={handleChange('url')} placeholder="ex: github.com" />
          </div>

          <div className={`form-field ${errors.username ? 'error' : ''}`}>
            <label>Usuário / Email *</label>
            <input type="text" value={form.username} onChange={handleChange('username')} placeholder="ex: usuario@email.com" />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className={`form-field ${errors.password ? 'error' : ''}`}>
            <label>Senha {isEdit ? '' : '*'}</label>
            <div className="password-input-row">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')}
                placeholder={isEdit ? 'Deixe em branco para manter a atual' : 'Digite ou gere uma senha...'}
              />
              <button type="button" className="icon-btn" onClick={() => setShowPassword(p => !p)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button type="button" className="icon-btn generate-btn" onClick={handleGenerate} disabled={generating} title="Gerar senha forte">
                <RefreshCw size={18} className={generating ? 'spinning' : ''} />
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
            <PasswordStrength password={form.password} />
          </div>

          <div className="form-field">
            <label>Categoria</label>
            <select value={form.categoryId} onChange={handleChange('categoryId')}>
              <option value="">Sem categoria</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Observações</label>
            <textarea
              value={form.notes}
              onChange={handleChange('notes')}
              placeholder="Notas opcionais..."
              rows={3}
            />
          </div>

          <div className="form-field form-field--inline">
            <input
              type="checkbox"
              id="favorite-check"
              checked={form.favorite}
              onChange={handleChange('favorite')}
            />
            <label htmlFor="favorite-check">Marcar como favorito</label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Adicionar Senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
