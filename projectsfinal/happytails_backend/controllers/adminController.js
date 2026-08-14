const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Pet = require('../models/Pet');
const Appointment = require('../models/Appointment');
const AdoptionApplication = require('../models/AdoptionApplication');
const bcrypt = require('bcryptjs');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'petadopt' });
  const totalDoctors = await User.countDocuments({ role: 'doctor' });
  const totalPets = await Pet.countDocuments();
  const availablePets = await Pet.countDocuments({ status: 'available' });
  const totalAppointments = await Appointment.countDocuments();
  const totalAdoptions = await AdoptionApplication.countDocuments();

  const appointmentsByStatus = await Appointment.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const adoptionsByStatus = await AdoptionApplication.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      users: totalUsers,
      doctors: totalDoctors,
      pets: totalPets,
      availablePets,
      appointments: totalAppointments,
      adoptions: totalAdoptions,
      appointmentsByStatus,
      adoptionsByStatus
    }
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;
  
  let query = {};
  
  if (role && role !== 'all') {
    query.role = role;
  }
  
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await User.find(query).select('-password').sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: { users }
  });
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['petadopt', 'doctor', 'admin'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role'
    });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    data: { user }
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Private/Admin
exports.getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await User.find({ role: 'doctor' })
    .select('-password')
    .sort({ rating: -1 });

  res.status(200).json({
    success: true,
    count: doctors.length,
    data: { doctors }
  });
});

// @desc    Create doctor
// @route   POST /api/admin/doctors
// @access  Private/Admin
exports.createDoctor = asyncHandler(async (req, res) => {
  const { fullName, email, password, specialization, experience, phone, address } = req.body;

  // Check if doctor already exists
  const existingDoctor = await User.findOne({ email });
  if (existingDoctor) {
    return res.status(400).json({
      success: false,
      message: 'Doctor with this email already exists'
    });
  }

  const doctor = await User.create({
    fullName,
    email,
    password,
    role: 'doctor',
    specialization,
    experience,
    phone,
    address
  });

  res.status(201).json({
    success: true,
    message: 'Doctor created successfully',
    data: { doctor: { id: doctor._id, fullName: doctor.fullName, email: doctor.email, role: doctor.role } }
  });
});

// @desc    Update doctor
// @route   PUT /api/admin/doctors/:id
// @access  Private/Admin
exports.updateDoctor = asyncHandler(async (req, res) => {
  const { password, role, ...updateData } = req.body;

  const doctor = await User.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');

  if (!doctor || doctor.role !== 'doctor') {
    return res.status(404).json({
      success: false,
      message: 'Doctor not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Doctor updated successfully',
    data: { doctor }
  });
});

// @desc    Delete doctor
// @route   DELETE /api/admin/doctors/:id
// @access  Private/Admin
exports.deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await User.findById(req.params.id);

  if (!doctor || doctor.role !== 'doctor') {
    return res.status(404).json({
      success: false,
      message: 'Doctor not found'
    });
  }

  await doctor.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Doctor deleted successfully'
  });
});

// @desc    Get all pets
// @route   GET /api/admin/pets
// @access  Private/Admin
exports.getAllPets = asyncHandler(async (req, res) => {
  const pets = await Pet.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: pets.length,
    data: { pets }
  });
});

// @desc    Create pet
// @route   POST /api/admin/pets
// @access  Private/Admin
exports.createPet = asyncHandler(async (req, res) => {
  const petData = {
    ...req.body,
    addedBy: req.user.id
  };

  try {
    const pet = await Pet.create(petData);

    res.status(201).json({
      success: true,
      message: 'Pet added successfully',
      data: { pet }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    throw error;
  }
});

// @desc    Update pet
// @route   PUT /api/admin/pets/:id
// @access  Private/Admin
exports.updatePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!pet) {
    return res.status(404).json({
      success: false,
      message: 'Pet not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Pet updated successfully',
    data: { pet }
  });
});

// @desc    Delete pet
// @route   DELETE /api/admin/pets/:id
// @access  Private/Admin
exports.deletePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    return res.status(404).json({
      success: false,
      message: 'Pet not found'
    });
  }

  await pet.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Pet deleted successfully'
  });
});

// @desc    Get all appointments
// @route   GET /api/admin/appointments
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

// @desc    Update appointment status
// @route   PUT /api/admin/appointments/:id/status
// @access  Private/Admin
exports.updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status, notes },
    { new: true, runValidators: true }
  );

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'Appointment not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Appointment status updated',
    data: { appointment }
  });
});

// @desc    Delete appointment
// @route   DELETE /api/admin/appointments/:id
// @access  Private/Admin
exports.deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      message: 'Appointment not found'
    });
  }

  await appointment.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Appointment deleted successfully'
  });
});

// @desc    Get all adoption applications
// @route   GET /api/admin/adoptions
// @access  Private/Admin
exports.getAllAdoptions = asyncHandler(async (req, res) => {
  const { status } = req.query;

  let query = {};
  if (status) {
    query.status = status;
  }

  const adoptions = await AdoptionApplication.find(query)
    .populate('petId', 'name type breed image')
    .populate('userId', 'fullName email phone')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: adoptions.length,
    data: { adoptions }
  });
});

// @desc    Update adoption application status
// @route   PUT /api/admin/adoptions/:id
// @access  Private/Admin
exports.updateAdoptionStatus = asyncHandler(async (req, res) => {
  const { status, reviewNotes } = req.body;

  const application = await AdoptionApplication.findById(req.params.id);

  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found'
    });
  }

  application.status = status;
  application.reviewNotes = reviewNotes;
  application.reviewedBy = req.user.id;
  application.reviewedAt = Date.now();

  await application.save();

  // If approved, update pet status
  if (status === 'approved') {
    await Pet.findByIdAndUpdate(application.petId, { status: 'adopted' });
  } else if (status === 'rejected') {
    const otherApplications = await AdoptionApplication.countDocuments({
      petId: application.petId,
      status: { $in: ['pending', 'under_review'] }
    });

    if (otherApplications === 0) {
      await Pet.findByIdAndUpdate(application.petId, { status: 'available' });
    }
  }

  res.status(200).json({
    success: true,
    message: 'Application status updated',
    data: { application }
  });
});
