const express = require('express');
const router = express.Router();
const {
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorAppointments,
  updateAppointmentStatus,
  updateAvailability
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

// All routes require doctor authentication
router.use(protect);
router.use(authorize('doctor'));

router.get('/profile', getDoctorProfile);
router.put('/profile', updateDoctorProfile);
router.get('/appointments', getDoctorAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);
router.put('/availability', updateAvailability);

module.exports = router;
