const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getAllAdoptions,
  updateAdoptionStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Dashboard Stats
router.get('/stats', getDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Doctor Management
router.get('/doctors', getAllDoctors);
router.post('/doctors', createDoctor);
router.put('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);

// Pet Management
router.get('/pets', getAllPets);
router.post('/pets', createPet);
router.put('/pets/:id', updatePet);
router.delete('/pets/:id', deletePet);

// Appointment Management
router.get('/appointments', getAllAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);
router.delete('/appointments/:id', deleteAppointment);

// Adoption Management
router.get('/adoptions', getAllAdoptions);
router.put('/adoptions/:id', updateAdoptionStatus);

module.exports = router;
