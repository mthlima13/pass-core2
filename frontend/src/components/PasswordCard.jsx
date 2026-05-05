import React, { useState } from 'react';
import { Key, Copy, Eye, EyeOff, Trash2, Star, ExternalLink, Pencil } from 'lucide-react';

export default function PasswordCard({ entry, onReveal, onToggleFavorite, onEdit, onDelete, index }) {
  const [showPassword, setShowPassword] = useState(false);
  const [revealedPassword, setRevealedPassword] = useState(null);
  const [copying, setCopying] = useState(false);

  const handleReveal = async () => {
    if (showPassword) {
      setShowPassword(false);
      setRevealedPassword(null);
      return;
    }
    const pwd = await onReveal(entry._id);
    if (pwd) {
      setRevealedPassword(pwd);
      setShowPassword(true);
    }
  };

  const handleCopy = async () => {
    const pwd = revealedPassword || await onReveal(entry._id);
    if (pwd) {
      await navigator.clipboard.writeText(pwd);
      setCopying(true);
      setTimeout(() => setCopying(false), 1500);
    }
  };

  const categoryName = entry.categoryId?.name || '';

  return (
    <div className="password-card" style={{ animationDelay: `${(index || 0) * 0.08}s` }}>
      <div className="card-header">
        <div className="service-icon">
          <Key size={24} />
        </div>
        <div className="service-info">
          <h3>{entry.serviceName}</h3>
          <p>{entry.url || 'Sem URL'}</p>
        </div>
        <div className="card-top-actions">
          {categoryName && <span className="category-badge">{categoryName}</span>}
          <button
            className={`icon-btn favorite-btn ${entry.favorite ? 'active' : ''}`}
            title={entry.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            onClick={() => onToggleFavorite(entry._id)}
          >
            <Star size={18} fill={entry.favorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="credential-field">
          <span className="field-label">Usuário</span>
          <span className="field-value">{entry.username}</span>
        </div>
        <div className="credential-field">
          <span className="field-label">Senha</span>
          <span className="field-value">
            {showPassword && revealedPassword ? revealedPassword : '••••••••••••'}
          </span>
        </div>
      </div>

      {entry.notes && (
        <div className="card-notes">
          <span className="field-label">Notas</span>
          <p>{entry.notes}</p>
        </div>
      )}

      <div className="card-actions">
        <button className={`icon-btn ${copying ? 'copied' : ''}`} title="Copiar Senha" onClick={handleCopy}>
          <Copy size={18} />
          {copying && <span className="copied-tooltip">Copiado!</span>}
        </button>
        <button
          className="icon-btn"
          title={showPassword ? 'Ocultar Senha' : 'Mostrar Senha'}
          onClick={handleReveal}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        <button className="icon-btn" title="Editar" onClick={() => onEdit(entry)}>
          <Pencil size={18} />
        </button>
        <button className="icon-btn delete-btn" title="Excluir" onClick={() => onDelete(entry)} style={{ marginLeft: 'auto' }}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
