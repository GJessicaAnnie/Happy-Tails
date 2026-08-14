const AdoptionApplication = require('../models/AdoptionApplication');
const Pet = require('../models/Pet');
const { asyncHandler } = require('../middleware/error');

// @desc    Submit adoption application
// @route   POST /api/adoption/apply
// @access  Private
exports.submitApplication = asyncHandler(async (req, res) => {
  const { petId, ...applicationData } = req.body;

  // Check if pet exists
  const pet = await Pet.findById(petId);

  if (!pet) {
    return res.status(404).json({
      success: false,
      message: 'Pet not found'
    });
  }

  if (pet.status !== 'available') {
    return res.status(400).json({
      success: false,
      message: 'This pet is not available for adoption'
    });
  }

  // Check if user already applied for this pet
  const existingApplication = await AdoptionApplication.findOne({
    petId,
    userId: req.user.id,
    status: { $in: ['pending', 'under_review'] }
  });

  if (existingApplication) {
    return res.status(400).json({
      success: false,
      message: 'You already have a pending application for this pet'
    });
  }

  // Create application
  const application = await AdoptionApplication.create({
    petId,
    userId: req.user.id,
    ...applicationData
  });

  // Update pet status to pending
  pet.status = 'pending';
  await pet.save();

  res.status(201).json({
    success: true,
    message: 'Adoption application submitted successfully',
    data: { application }
  });
});

// @desc    Get user's applications
// @route   GET /api/adoption/my-applications
// @access  Private
exports.getMyApplications = asyncHandler(async (req, res) => {
  const applications = await AdoptionApplication.find({ userId: req.user.id })
    .populate('petId', 'name breed type image')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    data: { applications }
  });
});

// @desc    Get all applications (Admin)
// @route   GET /api/adoption/applications
// @access  Private/Admin
exports.getAllApplications = asyncHandler(async (req, res) => {
  const { status, petId } = req.query;

  let query = {};

  if (status) {
    query.status = status;
  }

  if (petId) {
    query.petId = petId;
  }

  const applications = await AdoptionApplication.find(query)
    .populate('petId', 'name breed type image')
    .populate('userId', 'fullName email phone')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    data: { applications }
  });
});

// @desc    Get single application
// @route   GET /api/adoption/applications/:id
// @access  Private
exports.getApplication = asyncHandler(async (req, res) => {
  const application = await AdoptionApplication.findById(req.params.id)
    .populate('petId')
    .populate('userId', 'fullName email phone address');

  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found'
    });
  }

  // Check authorization
  if (
    req.user.role !== 'admin' &&
    application.userId._id.toString() !== req.user.id
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this application'
    });
  }

  res.status(200).json({
    success: true,
    data: { application }
  });
});

// @desc    Update application status
// @route   PUT /api/adoption/applications/:id
// @access  Private/Admin
exports.updateApplicationStatus = asyncHandler(async (req, res) => {
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
    // Check if there are other pending applications for this pet
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

// @desc    Get application statistics
// @route   GET /api/adoption/stats
// @access  Private/Admin
exports.getApplicationStats = asyncHandler(async (req, res) => {
  const stats = await AdoptionApplication.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const totalApplications = await AdoptionApplication.countDocuments();

  res.status(200).json({
    success: true,
    data: {
      totalApplications,
      byStatus: stats
    }
  });
});
