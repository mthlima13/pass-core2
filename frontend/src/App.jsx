import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';
import VaultView from './views/VaultView';
import FavoritesView from './views/FavoritesView';
import CategoriesView from './views/CategoriesView';
import SettingsView from './views/SettingsView';
import { usePasswords } from './hooks/usePasswords';
import './styles/variables.css';
import './App.css';

function AppContent() {
  const { currentView, theme, toasts, removeToast } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { passwords } = usePasswords();
  const favoriteCount = passwords.filter(p => p.favorite).length;

  const renderView = () => {
    switch (currentView) {
      case 'favorites': return <FavoritesView />;
      case 'categories': return <CategoriesView />;
      case 'settings': return <SettingsView />;
      default:
        return (
          <VaultView
            onAddClick={() => setShowPasswordModal(true)}
            showModal={showPasswordModal}
            setShowModal={setShowPasswordModal}
          />
        );
    }
  };

  return (
    <div className={`app-container theme-${theme}`}>
      <Sidebar
        passwordCount={passwords.length}
        favoriteCount={favoriteCount}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="app-main">
        <Header
          onAddPassword={() => setShowPasswordModal(true)}
          onToggleMobile={() => setMobileOpen(p => !p)}
        />
        <main className="main-content">
          {renderView()}
        </main>
      </div>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
