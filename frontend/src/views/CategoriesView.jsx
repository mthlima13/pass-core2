import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Key } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { usePasswords } from '../hooks/usePasswords';
import CategoryModal from '../components/CategoryModal';
import DeleteConfirm from '../components/DeleteConfirm';
import EmptyState from '../components/EmptyState';
import SkeletonCard from '../components/SkeletonCard';

export default function CategoriesView() {
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories();
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { passwords: filteredPasswords, loading: loadingPasswords } = usePasswords(
    selected ? { categoryId: selected._id } : {}
  );

  const handleSave = async (data) => {
    if (editCategory) return await updateCategory(editCategory._id, data);
    return await createCategory(data);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await deleteCategory(deleteTarget._id);
    setDeleting(false);
    setDeleteTarget(null);
    if (ok && selected?._id === deleteTarget._id) setSelected(null);
  };

  const openEdit = (cat) => {
    setEditCategory(cat);
    setShowModal(true);
  };

  return (
    <div className="view">
      <div className="view-header">
        <div>
          <h2 className="view-title">Categorias</h2>
          <span className="view-count">{categories.length} categoria{categories.length !== 1 ? 's' : ''}</span>
        </div>
        <button className="btn-primary" onClick={() => { setEditCategory(null); setShowModal(true); }}>
          <Plus size={18} />
          Nova Categoria
        </button>
      </div>

      <div className="categories-layout">
        {/* Lista de categorias */}
        <div className="categories-list">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="category-item skeleton-category" />
            ))
          ) : categories.length === 0 ? (
            <EmptyState type="categories" onAction={() => setShowModal(true)} />
          ) : (
            categories.map(cat => (
              <div
                key={cat._id}
                className={`category-item ${selected?._id === cat._id ? 'active' : ''}`}
                onClick={() => setSelected(prev => prev?._id === cat._id ? null : cat)}
              >
                <div className="category-item-icon">
                  {cat.name.charAt(0).toUpperCase()}
                </div>
                <span className="category-item-name">{cat.name}</span>
                <div className="category-item-actions">
                  <button className="icon-btn" onClick={(e) => { e.stopPropagation(); openEdit(cat); }} title="Editar">
                    <Pencil size={15} />
                  </button>
                  <button className="icon-btn delete-btn" onClick={(e) => { e.stopPropagation(); setDeleteTarget(cat); }} title="Excluir">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Senhas da categoria selecionada */}
        {selected && (
          <div className="categories-passwords">
            <h3 className="category-password-title">
              <Key size={18} /> Senhas em "{selected.name}"
            </h3>
            {loadingPasswords ? (
              <div className="vault-grid">
                {Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredPasswords.length === 0 ? (
              <p className="empty-category-msg">Nenhuma senha nesta categoria.</p>
            ) : (
              <div className="vault-grid">
                {filteredPasswords.map((entry) => (
                  <div key={entry._id} className="category-password-card">
                    <span className="category-password-name">{entry.serviceName}</span>
                    <span className="category-password-user">{entry.username}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <CategoryModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditCategory(null); }}
        onSave={handleSave}
        category={editCategory}
      />

      <DeleteConfirm
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Excluir Categoria"
        description={`Tem certeza que deseja excluir a categoria "${deleteTarget?.name}"?`}
      />
    </div>
  );
}
