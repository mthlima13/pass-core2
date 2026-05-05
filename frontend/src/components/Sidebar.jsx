import React from 'react';
import { Shield, Key, Star, Folder, Settings, ShieldCheck, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { id: 'vault', label: 'Todas as Senhas', icon: Key },
  { id: 'favorites', label: 'Favoritos', icon: Star },
  { id: 'categories', label: 'Categorias', icon: Folder },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export default function Sidebar({ passwordCount, favoriteCount, mobileOpen, onCloseMobile }) {
  const { currentView, setCurrentView } = useApp();

  const handleNav = (id) => {
    setCurrentView(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onCloseMobile} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-top">
          <div className="logo">
            <Shield size={32} />
            <span>PassCore2</span>
          </div>
          <button className="sidebar-close-btn" onClick={onCloseMobile}>
            <X size={24} />
          </button>
        </div>

        <nav className="nav-links">
          {navItems.map(item => {
            const Icon = item.icon;
            let badge = null;
            if (item.id === 'vault') badge = passwordCount;
            if (item.id === 'favorites') badge = favoriteCount;

            return (
              <div
                key={item.id}
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => handleNav(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {badge > 0 && <span className="nav-badge">{badge}</span>}
              </div>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div className="nav-item" onClick={() => handleNav('vault')}>
            <div className="service-icon" style={{ width: 32, height: 32 }}>
              <ShieldCheck size={16} />
            </div>
            <span>Auditoria</span>
          </div>
        </div>
      </aside>
    </>
  );
}
