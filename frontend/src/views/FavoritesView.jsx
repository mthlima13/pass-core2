import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { usePasswords } from '../hooks/usePasswords';
import PasswordCard from '../components/PasswordCard';
import PasswordModal from '../components/PasswordModal';
import DeleteConfirm from '../components/DeleteConfirm';
import EmptyState from '../components/EmptyState';
import SkeletonCard from '../components/SkeletonCard';

export default function FavoritesView() {
  const { categories } = useCategories();
  const {
    passwords, loading,
    updatePassword, deletePassword,
    toggleFavorite, revealPassword,
  } = usePasswords({ favorite: 'true' });

  const [editEntry, setEditEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteEntry, setDeleteEntry] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async (data) => {
    if (editEntry) return await updatePassword(editEntry._id, data);
    return false;
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

  return (
    <div className="view">
      <div className="view-header">
        <div>
          <h2 className="view-title">Favoritos</h2>
          <span className="view-count">
            {loading ? '...' : `${passwords.length} favorito${passwords.length !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="vault-grid">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : passwords.length === 0 ? (
        <EmptyState type="favorites" />
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
        onClose={() => { setShowModal(false); setEditEntry(null); }}
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
        description={`Excluir a senha de "${deleteEntry?.serviceName}"?`}
      />
    </div>
  );
}
