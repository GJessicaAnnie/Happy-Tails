const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/error');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private
exports.bookAppointment = asyncHandler(async (req, res) => {
  const { vetName, vetId, date, timeSlot, ownerName, petName, petType, contactNumber, reason } = req.body;

  // Check if vet exists and is available
  const vet = await User.findOne({ _id: vetId, role: 'doctor' });

  if (!vet) {
    return res.status(404).json({
      success: false,
      message: 'Veterinarian not found'
    });
  }

  if (!vet.isAvailable) {
    return res.status(400).json({
      success: false,
      message: 'This veterinarian is currently unavailable'
    });
  }

  // Check if slot is already booked
  const existingAppointment = await Appointment.findOne({
    vetId,
    date: new Date(date),
    timeSlot,
    status: { $ne: 'cancelled' }
  });

  if (existingAppointment) {
    return res.status(400).json({
      success: false,
      message: 'This time slot is already booked'
    });
  }

  // Create appointment
  const appointment = await Appointment.create({
    vetName,
    vetId,
    userId: req.user.id,
    date,
    timeSlot,
    ownerName,
    petName,
    petType,
    contactNumber,
    reason
  });

  res.status(201).json({
    success: true,
    message: 'Appointment booked successfully',
    data: { appointment }
  });
});

// @desc    Get user's appointments
// @route   GET /api/appointments/my
// @access  Private
exports.getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ userId: req.user.id })
    .sort({ date: -1, timeSlot: -1 });

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: { appointments }
  });
});

// @desc    Get appointments for a doctor
// @route   GET /api/appointments/doctor/:doctorId
// @access  Private/Doctor
exports.getDoctorAppointments = asyncHandler(async (req, res) => {
  const { date } = req.query;

  let query = { vetId: req.params.doctorId };

  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    query.date = { $gte: startDate, $lt: endDate };
  }

  const appointments = await Appointment.find(query)
    .sort({ date: 1, timeSlot: 1 });

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: { appointments }
  });
});

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
// @access  Private/Admin
exports.getAllAppointments = asyncHandler(async (req, res) => {
  const { status, date } = req.query;

  let query = {};

  if (status) {
    query.status = status;
  }

  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    query.date = { $gte: startDate, $lt: endDate };
  }

  const appointments = await Appointment.find(query)
    .populate('userId', 'fullName email phone')
    .populate('vetId', 'fullName specialization')
    .sort({ date: -1, timeSlot: -1 });

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: { appointments }
  });
});

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('userId', 'fullName email phone')
    .populate('vetId', 'fullName specialization');

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'Appointment not found'
    });
  }

  // Check authorization
  if (
    req.user.role !== 'admin' &&
    appointment.userId._id.toString() !== req.user.id &&
    appointment.vetId._id.toString() !== req.user.id
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this appointment'
    });
  }

  res.status(200).json({
    success: true,
    data: { appointment }
  });
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private
exports.updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'Appointment not found'
    });
  }

  // Check authorization
  if (
    req.user.role !== 'admin' &&
    appointment.userId.toString() !== req.user.id &&
    appointment.vetId.toString() !== req.user.id
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this appointment'
    });
  }

  appointment.status = status;
  await appointment.save();

  res.status(200).json({
    success: true,
    message: 'Appointment status updated',
    data: { appointment }
  });
});

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'Appointment not found'
    });
  }

  // Check authorization
  if (
    req.user.role !== 'admin' &&
    appointment.userId.toString() !== req.user.id
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to cancel this appointment'
    });
  }

  appointment.status = 'cancelled';
  await appointment.save();

  res.status(200).json({
    success: true,
    message: 'Appointment cancelled successfully',
    data: { appointment }
  });
});

// @desc    Get booked slots for a doctor on a specific date
// @route   GET /api/appointments/booked-slots
// @access  Public
exports.getBookedSlots = asyncHandler(async (req, res) => {
  const { vetId, date } = req.query;

  if (!vetId || !date) {
    return res.status(400).json({
      success: false,
      message: 'vetId and date are required'
    });
  }

  const startDate = new Date(date);
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1);

  const appointments = await Appointment.find({
    vetId,
    date: { $gte: startDate, $lt: endDate },
    status: { $ne: 'cancelled' }
  }).select('timeSlot');

  const bookedSlots = appointments.map(app => app.timeSlot);

  res.status(200).json({
    success: true,
    data: { bookedSlots }
  });
});
