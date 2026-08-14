import api from './api';

export const petService = {
  // Get all pets with filters
  getPets: async (params = {}) => {
    const response = await api.get('/pets', { params });
    return response.data;
  },

  // Get single pet
  getPet: async (id) => {
    const response = await api.get(`/pets/${id}`);
    return response.data;
  },

  // Get available locations
  getLocations: async () => {
    const response = await api.get('/pets/locations');
    return response.data;
  },

  // Create pet (Admin only)
  createPet: async (petData) => {
    const response = await api.post('/pets', petData);
    return response.data;
  },

  // Update pet (Admin only)
  updatePet: async (id, petData) => {
    const response = await api.put(`/pets/${id}`, petData);
    return response.data;
  },

  // Delete pet (Admin only)
  deletePet: async (id) => {
    const response = await api.delete(`/pets/${id}`);
    return response.data;
  },
};
