import React from 'react';
import { Moon, Sun, Download, Upload, Shield, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePasswords } from '../hooks/usePasswords';
import { passwordService } from '../services/passwordService';

export default function SettingsView() {
  const { theme, toggleTheme, addToast } = useApp();
  const { passwords } = usePasswords();

  const handleExport = () => {
    const exportData = passwords.map(p => ({
      serviceName: p.serviceName,
      username: p.username,
      url: p.url,
      notes: p.notes,
      category: p.categoryId?.name || '',
      favorite: p.favorite,
      createdAt: p.createdAt,
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passcore2-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Backup exportado com sucesso!', 'success');
  };

  return (
    <div className="view">
      <div className="view-header">
        <div>
          <h2 className="view-title">Configurações</h2>
          <span className="view-count">Personalize sua experiência</span>
        </div>
      </div>

      <div className="settings-grid">
        {/* Aparência */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Shield size={20} />
            <h3>Aparência</h3>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              <div>
                <span className="settings-item-title">Tema</span>
                <span className="settings-item-desc">
                  {theme === 'dark' ? 'Modo escuro ativo' : 'Modo claro ativo'}
                </span>
              </div>
            </div>
            <button className="toggle-btn" onClick={toggleTheme}>
              <span className={`toggle-thumb ${theme === 'light' ? 'toggle-thumb--on' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dados */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Download size={20} />
            <h3>Dados</h3>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <Download size={20} />
              <div>
                <span className="settings-item-title">Exportar Senhas</span>
                <span className="settings-item-desc">Baixar backup em JSON ({passwords.length} senhas)</span>
              </div>
            </div>
            <button className="btn-secondary" onClick={handleExport}>
              Exportar
            </button>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <Upload size={20} />
              <div>
                <span className="settings-item-title">Importar Senhas</span>
                <span className="settings-item-desc">Restaurar backup de arquivo JSON</span>
              </div>
            </div>
            <label className="btn-secondary" style={{ cursor: 'pointer' }}>
              Importar
              <input
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  addToast('Importação em desenvolvimento', 'info');
                }}
              />
            </label>
          </div>
        </div>

        {/* Segurança */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Clock size={20} />
            <h3>Segurança</h3>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <Clock size={20} />
              <div>
                <span className="settings-item-title">Timeout Automático</span>
                <span className="settings-item-desc">Logout automático após inatividade (em desenvolvimento)</span>
              </div>
            </div>
            <span className="settings-badge">Em breve</span>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <Shield size={20} />
              <div>
                <span className="settings-item-title">Autenticação 2FA</span>
                <span className="settings-item-desc">Proteção extra com dois fatores (em desenvolvimento)</span>
              </div>
            </div>
            <span className="settings-badge">Em breve</span>
          </div>
        </div>

        {/* Sobre */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Shield size={20} />
            <h3>Sobre</h3>
          </div>
          <div className="settings-about">
            <p><strong>PassCore2</strong> v1.0.0</p>
            <p>Gerenciador de senhas seguro com criptografia AES-256.</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Suas senhas são criptografadas localmente antes de serem salvas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
