const express = require('express');
const router = express.Router();
const { 
  bookAppointment, 
  getMyAppointments, 
  getDoctorAppointments, 
  getAllAppointments,
  getAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  getBookedSlots
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/booked-slots', getBookedSlots);
router.get('/my', protect, getMyAppointments);
router.get('/doctor/:doctorId', protect, authorize('doctor', 'admin'), getDoctorAppointments);
router.get('/', protect, authorize('admin'), getAllAppointments);
router.get('/:id', protect, getAppointment);
router.post('/', protect, bookAppointment);
router.put('/:id/status', protect, updateAppointmentStatus);
router.delete('/:id', protect, cancelAppointment);

module.exports = router;
