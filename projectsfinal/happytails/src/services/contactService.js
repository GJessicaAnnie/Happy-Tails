import api from './api';

export const contactService = {
  // Submit contact message
  submitMessage: async (messageData) => {
    const response = await api.post('/contact', messageData);
    return response.data;
  },

  // Get all messages (Admin)
  getAllMessages: async (params = {}) => {
    const response = await api.get('/contact', { params });
    return response.data;
  },

  // Get single message (Admin)
  getMessage: async (id) => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },

  // Update message status (Admin)
  updateMessageStatus: async (id, status) => {
    const response = await api.put(`/contact/${id}/status`, { status });
    return response.data;
  },

  // Delete message (Admin)
  deleteMessage: async (id) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },

  // Get message statistics (Admin)
  getMessageStats: async () => {
    const response = await api.get('/contact/stats');
    return response.data;
  },
};
