const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Get doctor's own profile
// @route   GET /api/doctor/profile
// @access  Private/Doctor
exports.getDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await User.findById(req.user.id).select('-password');
  
  if (!doctor || doctor.role !== 'doctor') {
    return res.status(404).json({
      success: false,
      message: 'Doctor profile not found'
    });
  }

  res.status(200).json({
    success: true,
    data: { doctor }
  });
});

// @desc    Update doctor's profile
// @route   PUT /api/doctor/profile
// @access  Private/Doctor
exports.updateDoctorProfile = asyncHandler(async (req, res) => {
  const { password, role, ...updateData } = req.body;

  const doctor = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');

  if (!doctor || doctor.role !== 'doctor') {
    return res.status(404).json({
      success: false,
      message: 'Doctor profile not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { doctor }
  });
});

// @desc    Get doctor's appointments
// @route   GET /api/doctor/appointments
// @access  Private/Doctor
exports.getDoctorAppointments = asyncHandler(async (req, res) => {
  const { date, status } = req.query;

  let query = { vetId: req.user.id };

  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    query.date = { $gte: startDate, $lt: endDate };
  }

  if (status) {
    query.status = status;
  }

  const appointments = await Appointment.find(query)
    .sort({ date: 1, timeSlot: 1 })
    .populate('userId', 'fullName email phone');

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: { appointments }
  });
});

// @desc    Update appointment status
// @route   PUT /api/doctor/appointments/:id/status
// @access  Private/Doctor
exports.updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'Appointment not found'
    });
  }

  // Ensure doctor can only update their own appointments
  if (appointment.vetId.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this appointment'
    });
  }

  appointment.status = status;
  if (notes) {
    appointment.notes = notes;
  }

  await appointment.save();

  res.status(200).json({
    success: true,
    message: 'Appointment status updated',
    data: { appointment }
  });
});

// @desc    Update doctor availability
// @route   PUT /api/doctor/availability
// @access  Private/Doctor
exports.updateAvailability = asyncHandler(async (req, res) => {
  const { isAvailable, workingHours } = req.body;

  const updateData = {};
  if (typeof isAvailable === 'boolean') {
    updateData.isAvailable = isAvailable;
  }
  if (workingHours) {
    updateData.workingHours = workingHours;
  }

  const doctor = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');

  res.status(200).json({
    success: true,
    message: 'Availability updated successfully',
    data: { doctor }
  });
});
