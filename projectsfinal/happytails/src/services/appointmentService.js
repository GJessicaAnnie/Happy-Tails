import api from './api';

export const appointmentService = {
  // Book new appointment
  bookAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  // Get user's appointments
  getMyAppointments: async () => {
    const response = await api.get('/appointments/my');
    return response.data;
  },

  // Get single appointment
  getAppointment: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  // Update appointment status
  updateAppointmentStatus: async (id, status) => {
    const response = await api.put(`/appointments/${id}/status`, { status });
    return response.data;
  },

  // Cancel appointment
  cancelAppointment: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },

  // Get booked slots for a doctor on a date
  getBookedSlots: async (vetId, date) => {
    const response = await api.get('/appointments/booked-slots', {
      params: { vetId, date }
    });
    return response.data;
  },

  // Get doctor's appointments (Doctor/Admin)
  getDoctorAppointments: async (doctorId, date) => {
    const response = await api.get(`/appointments/doctor/${doctorId}`, {
      params: { date }
    });
    return response.data;
  },

  // Get all appointments (Admin)
  getAllAppointments: async (params = {}) => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },
};
