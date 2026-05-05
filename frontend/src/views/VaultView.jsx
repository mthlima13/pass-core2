import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { usePasswords } from '../hooks/usePasswords';
import { useCategories } from '../hooks/useCategories';
import PasswordCard from '../components/PasswordCard';
import PasswordModal from '../components/PasswordModal';
import DeleteConfirm from '../components/DeleteConfirm';
import EmptyState from '../components/EmptyState';
import SkeletonCard from '../components/SkeletonCard';
import Header from '../components/Header';
import { Filter, ChevronDown } from 'lucide-react';

export default function VaultView({ onAddClick, showModal, setShowModal }) {
  const { searchTerm } = useApp();
  const { categories } = useCategories();

  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [editEntry, setEditEntry] = useState(null);
  const [deleteEntry, setDeleteEntry] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const debounceRef = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(searchTerm), 350);
    return () => clearTimeout(debounceRef.current);
  }, [searchTerm]);

  const filterOptions = {};
  if (debouncedSearch) filterOptions.search = debouncedSearch;
  if (filterCategory) filterOptions.categoryId = filterCategory;
  if (sortBy) filterOptions.sort = sortBy;

  const {
    passwords, loading, pagination,
    createPassword, updatePassword, deletePassword,
    toggleFavorite, revealPassword, fetchPasswords
  } = usePasswords(filterOptions);

  const handleSave = async (data) => {
    if (editEntry) {
      return await updatePassword(editEntry._id, data);
    }
    return await createPassword(data);
  };

  const handleDelete = async () => {
    if (!deleteEntry) return;
    setDeleting(true);
    await deletePassword(deleteEntry._id);
    setDeleting(false);
    setDeleteEntry(null);
  };

  const handleEdit = (entry) => {
    setEditEntry(entry);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditEntry(null);
  };

  const isEmpty = !loading && passwords.length === 0;
  const hasSearch = Boolean(debouncedSearch || filterCategory);

  return (
    <div className="view">
      <div className="view-header">
        <div>
          <h2 className="view-title">Todas as Senhas</h2>
          <span className="view-count">
            {loading ? '...' : `${pagination.total} senha${pagination.total !== 1 ? 's' : ''} no total`}
          </span>
        </div>
        <div className="view-filters">
          <div className="filter-select-wrapper">
            <Filter size={16} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">Todas as categorias</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown size={14} />
          </div>
          <div className="filter-select-wrapper">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="createdAt">Mais recentes</option>
              <option value="serviceName">Nome (A-Z)</option>
              <option value="updatedAt">Última atualização</option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="vault-grid">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : isEmpty ? (
        <EmptyState
          type={hasSearch ? 'search' : 'vault'}
          onAction={!hasSearch ? onAddClick : null}
        />
      ) : (
        <div className="vault-grid">
          {passwords.map((entry, i) => (
            <PasswordCard
              key={entry._id}
              entry={entry}
              index={i}
              onReveal={revealPassword}
              onToggleFavorite={toggleFavorite}
              onEdit={handleEdit}
              onDelete={setDeleteEntry}
            />
          ))}
        </div>
      )}

      <PasswordModal
        open={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        entry={editEntry}
        categories={categories}
      />

      <DeleteConfirm
        open={Boolean(deleteEntry)}
        onClose={() => setDeleteEntry(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Excluir Senha"
        description={`Tem certeza que deseja excluir a senha de "${deleteEntry?.serviceName}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}
