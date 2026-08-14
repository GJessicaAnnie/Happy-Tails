import api from './api';

export const adminService = {
  // Dashboard Stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // User Management
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Doctor Management
  getAllDoctors: async () => {
    const response = await api.get('/admin/doctors');
    return response.data;
  },

  createDoctor: async (doctorData) => {
    const response = await api.post('/admin/doctors', doctorData);
    return response.data;
  },

  updateDoctor: async (id, doctorData) => {
    const response = await api.put(`/admin/doctors/${id}`, doctorData);
    return response.data;
  },

  deleteDoctor: async (id) => {
    const response = await api.delete(`/admin/doctors/${id}`);
    return response.data;
  },

  // Pet Management
  getAllPets: async () => {
    const response = await api.get('/admin/pets');
    return response.data;
  },

  createPet: async (petData) => {
    const response = await api.post('/admin/pets', petData);
    return response.data;
  },

  updatePet: async (id, petData) => {
    const response = await api.put(`/admin/pets/${id}`, petData);
    return response.data;
  },

  deletePet: async (id) => {
    const response = await api.delete(`/admin/pets/${id}`);
    return response.data;
  },

  // Appointment Management
  getAllAppointments: async (params = {}) => {
    const response = await api.get('/admin/appointments', { params });
    return response.data;
  },

  updateAppointmentStatus: async (id, statusData) => {
    const response = await api.put(`/admin/appointments/${id}/status`, statusData);
    return response.data;
  },

  deleteAppointment: async (id) => {
    const response = await api.delete(`/admin/appointments/${id}`);
    return response.data;
  },

  // Adoption Management
  getAllAdoptions: async (params = {}) => {
    const response = await api.get('/admin/adoptions', { params });
    return response.data;
  },

  updateAdoptionStatus: async (id, statusData) => {
    const response = await api.put(`/admin/adoptions/${id}`, statusData);
    return response.data;
  }
};
