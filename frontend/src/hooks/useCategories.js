import { useState, useCallback, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import { useApp } from '../context/AppContext';

export function useCategories() {
  const { addToast } = useApp();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      addToast('Erro ao carregar categorias', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = useCallback(async (data) => {
    try {
      await categoryService.create(data);
      addToast('Categoria criada com sucesso!', 'success');
      fetchCategories();
      return true;
    } catch (err) {
      addToast(err.response?.data?.error || 'Erro ao criar categoria', 'error');
      return false;
    }
  }, [addToast, fetchCategories]);

  const updateCategory = useCallback(async (id, data) => {
    try {
      await categoryService.update(id, data);
      addToast('Categoria atualizada!', 'success');
      fetchCategories();
      return true;
    } catch (err) {
      addToast(err.response?.data?.error || 'Erro ao atualizar categoria', 'error');
      return false;
    }
  }, [addToast, fetchCategories]);

  const deleteCategory = useCallback(async (id) => {
    try {
      await categoryService.remove(id);
      addToast('Categoria excluída!', 'success');
      fetchCategories();
      return true;
    } catch (err) {
      addToast(err.response?.data?.error || 'Erro ao excluir categoria', 'error');
      return false;
    }
  }, [addToast, fetchCategories]);

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
