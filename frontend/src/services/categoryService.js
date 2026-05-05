import api from './api';

export const categoryService = {
  async getAll() {
    const { data } = await api.get('/categories');
    return data;
  },

  async create(categoryData) {
    const { data } = await api.post('/categories', categoryData);
    return data;
  },

  async update(id, categoryData) {
    const { data } = await api.put(`/categories/${id}`, categoryData);
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  },
};
