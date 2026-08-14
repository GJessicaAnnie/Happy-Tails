import api from './api';

export const adoptionService = {
  // Submit adoption application
  submitApplication: async (applicationData) => {
    const response = await api.post('/adoption/apply', applicationData);
    return response.data;
  },

  // Get user's applications
  getMyApplications: async () => {
    const response = await api.get('/adoption/my-applications');
    return response.data;
  },

  // Get single application
  getApplication: async (id) => {
    const response = await api.get(`/adoption/applications/${id}`);
    return response.data;
  },

  // Get all applications (Admin)
  getAllApplications: async (params = {}) => {
    const response = await api.get('/adoption/applications', { params });
    return response.data;
  },

  // Update application status (Admin)
  updateApplicationStatus: async (id, statusData) => {
    const response = await api.put(`/adoption/applications/${id}`, statusData);
    return response.data;
  },

  // Get application statistics (Admin)
  getApplicationStats: async () => {
    const response = await api.get('/adoption/stats');
    return response.data;
  },
};
