import { useState, useCallback, useEffect } from 'react';
import { passwordService } from '../services/passwordService';
import { useApp } from '../context/AppContext';

export function usePasswords(filterOptions = {}) {
  const { addToast } = useApp();
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, pages: 0 });

  const fetchPasswords = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const mergedParams = { ...filterOptions, ...params };
      const result = await passwordService.getAll(mergedParams);
      setPasswords(result.entries || []);
      setPagination(result.pagination || { page: 1, limit: 50, total: 0, pages: 0 });
    } catch (err) {
      addToast('Erro ao carregar senhas', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [addToast, JSON.stringify(filterOptions)]);

  useEffect(() => {
    fetchPasswords();
  }, [fetchPasswords]);

  const createPassword = useCallback(async (data) => {
    try {
      await passwordService.create(data);
      addToast('Senha adicionada com sucesso!', 'success');
      fetchPasswords();
      return true;
    } catch (err) {
      addToast(err.response?.data?.error || 'Erro ao adicionar senha', 'error');
      return false;
    }
  }, [addToast, fetchPasswords]);

  const updatePassword = useCallback(async (id, data) => {
    try {
      await passwordService.update(id, data);
      addToast('Senha atualizada com sucesso!', 'success');
      fetchPasswords();
      return true;
    } catch (err) {
      addToast(err.response?.data?.error || 'Erro ao atualizar senha', 'error');
      return false;
    }
  }, [addToast, fetchPasswords]);

  const deletePassword = useCallback(async (id) => {
    try {
      await passwordService.remove(id);
      addToast('Senha excluída com sucesso!', 'success');
      fetchPasswords();
      return true;
    } catch (err) {
      addToast(err.response?.data?.error || 'Erro ao excluir senha', 'error');
      return false;
    }
  }, [addToast, fetchPasswords]);

  const toggleFavorite = useCallback(async (id) => {
    try {
      const updated = await passwordService.toggleFavorite(id);
      setPasswords(prev => prev.map(p => (p._id === id ? updated : p)));
      addToast(updated.favorite ? 'Adicionado aos favoritos!' : 'Removido dos favoritos', 'success');
    } catch (err) {
      addToast('Erro ao atualizar favorito', 'error');
    }
  }, [addToast]);

  const revealPassword = useCallback(async (id) => {
    try {
      return await passwordService.revealPassword(id);
    } catch (err) {
      addToast('Erro ao revelar senha', 'error');
      return null;
    }
  }, [addToast]);

  return {
    passwords,
    loading,
    pagination,
    fetchPasswords,
    createPassword,
    updatePassword,
    deletePassword,
    toggleFavorite,
    revealPassword,
  };
}
