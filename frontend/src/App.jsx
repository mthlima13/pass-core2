import React, { useState } from 'react';
import { 
  Shield, 
  Search, 
  Plus, 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  Settings, 
  Folder, 
  Star,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import './styles/variables.css';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState({});

  const togglePassword = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const mockPasswords = [
    { id: 1, service: 'GitHub', user: 'dev_master', pass: '••••••••••••', url: 'github.com', category: 'Dev' },
    { id: 2, service: 'Google', user: 'contact@company.com', pass: '••••••••••••', url: 'google.com', category: 'Work' },
    { id: 3, service: 'Netflix', user: 'home_viewer', pass: '••••••••••••', url: 'netflix.com', category: 'Personal' },
    { id: 4, service: 'Bank of America', user: 'finance_pro', pass: '••••••••••••', url: 'bankofamerica.com', category: 'Finance' },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <Shield size={32} />
          <span>PassCore2</span>
        </div>

        <nav className="nav-links">
          <div className="nav-item active">
            <Key size={20} />
            <span>All Passwords</span>
          </div>
          <div className="nav-item">
            <Star size={20} />
            <span>Favorites</span>
          </div>
          <div className="nav-item">
            <Folder size={20} />
            <span>Categories</span>
          </div>
          <div className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div className="nav-item">
            <div className="service-icon" style={{ width: 32, height: 32 }}>
              <Shield size={16} />
            </div>
            <span>Security Audit</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search services, usernames..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="action-buttons">
            <button className="btn-primary">
              <Plus size={20} />
              Add Password
            </button>
          </div>
        </header>

        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Your Vault</h2>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>4 passwords total</span>
          </div>

          <div className="vault-grid">
            {mockPasswords.map((item, index) => (
              <div key={item.id} className="password-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card-header">
                  <div className="service-icon">
                    <Key size={24} />
                  </div>
                  <div className="service-info">
                    <h3>{item.service}</h3>
                    <p>{item.url}</p>
                  </div>
                  <ExternalLink size={18} style={{ marginLeft: 'auto', color: 'var(--text-secondary)', cursor: 'pointer' }} />
                </div>

                <div className="card-body">
                  <div className="credential-field">
                    <span className="field-label">Username</span>
                    <span className="field-value">{item.user}</span>
                  </div>
                  <div className="credential-field">
                    <span className="field-label">Password</span>
                    <span className="field-value">
                      {showPassword[item.id] ? 'S3cur3P@ss!' : item.pass}
                    </span>
                  </div>
                </div>

                <div className="card-actions">
                  <button className="icon-btn" title="Copy Password">
                    <Copy size={18} />
                  </button>
                  <button 
                    className="icon-btn" 
                    title={showPassword[item.id] ? "Hide Password" : "Show Password"}
                    onClick={() => togglePassword(item.id)}
                  >
                    {showPassword[item.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button className="icon-btn" style={{ marginLeft: 'auto' }} title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
