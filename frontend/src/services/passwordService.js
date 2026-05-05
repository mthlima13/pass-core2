import api from './api';

export const passwordService = {
  async getAll(params = {}) {
    const { data } = await api.get('/entries', { params });
    return data;
  },

  async create(entryData) {
    const { data } = await api.post('/entries', entryData);
    return data;
  },

  async update(id, entryData) {
    const { data } = await api.put(`/entries/${id}`, entryData);
    return data;
  },

  async remove(id) {
    const { data } = await api.delete(`/entries/${id}`);
    return data;
  },

  async revealPassword(id) {
    const { data } = await api.get(`/entries/${id}/reveal`);
    return data.password;
  },

  async toggleFavorite(id) {
    const { data } = await api.patch(`/entries/${id}/favorite`);
    return data;
  },
};
