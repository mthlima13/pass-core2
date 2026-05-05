import React from 'react';
import { Search, Plus, Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header({ onAddPassword, onToggleMobile }) {
  const { searchTerm, setSearchTerm } = useApp();

  return (
    <header className="header">
      <button className="mobile-menu-btn" onClick={onToggleMobile}>
        <Menu size={24} />
      </button>

      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder="Pesquisar serviços, usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="action-buttons">
        <button className="btn-primary" onClick={onAddPassword}>
          <Plus size={20} />
          Adicionar Senha
        </button>
      </div>
    </header>
  );
}
