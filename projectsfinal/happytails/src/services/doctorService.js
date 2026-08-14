import api from './api';

export const doctorService = {
  // Profile Management
  getProfile: async () => {
    const response = await api.get('/doctor/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/doctor/profile', profileData);
    return response.data;
  },

  // Appointments
  getAppointments: async (params = {}) => {
    const response = await api.get('/doctor/appointments', { params });
    return response.data;
  },

  updateAppointmentStatus: async (id, statusData) => {
    const response = await api.put(`/doctor/appointments/${id}/status`, statusData);
    return response.data;
  },

  // Availability
  updateAvailability: async (availabilityData) => {
    const response = await api.put('/doctor/availability', availabilityData);
    return response.data;
  }
};
