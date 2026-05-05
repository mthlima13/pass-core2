import api from './api';

export const utilsService = {
  async generatePassword(options = {}) {
    const params = {
      length: options.length || 16,
      numbers: options.numbers !== false ? 'true' : 'false',
      symbols: options.symbols !== false ? 'true' : 'false',
      uppercase: options.uppercase !== false ? 'true' : 'false',
    };
    const { data } = await api.get('/utils/generate-password', { params });
    return data.password;
  },
};
