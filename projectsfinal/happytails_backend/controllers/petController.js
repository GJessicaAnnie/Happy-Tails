const Pet = require('../models/Pet');
const { asyncHandler } = require('../middleware/error');

// @desc    Get all pets with filtering
// @route   GET /api/pets
// @access  Public
exports.getPets = asyncHandler(async (req, res) => {
  const { type, location, status, search, age } = req.query;

  // Build query
  let query = {};

  if (type && type !== 'all') {
    query.type = type;
  }

  if (location && location !== 'all') {
    query.location = location;
  }

  if (status) {
    query.status = status;
  } else {
    // Default to available pets
    query.status = 'available';
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { breed: { $regex: search, $options: 'i' } }
    ];
  }

  // Age filter
  if (age && age !== 'all') {
    if (age === 'young') {
      query.age = { $regex: /^[0-2]/ };
    } else if (age === 'adult') {
      query.age = { $regex: /^[3-5]/ };
    } else if (age === 'senior') {
      query.age = { $regex: /^[6-9]/ };
    }
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const pets = await Pet.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Pet.countDocuments(query);

  res.status(200).json({
    success: true,
    count: pets.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: { pets }
  });
});

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Public
exports.getPet = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    return res.status(404).json({
      success: false,
      message: 'Pet not found'
    });
  }

  res.status(200).json({
    success: true,
    data: { pet }
  });
});

// @desc    Create new pet
// @route   POST /api/pets
// @access  Private/Admin
exports.createPet = asyncHandler(async (req, res) => {
  req.body.addedBy = req.user.id;

  const pet = await Pet.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Pet added successfully',
    data: { pet }
  });
});

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private/Admin
exports.updatePet = asyncHandler(async (req, res) => {
  let pet = await Pet.findById(req.params.id);

  if (!pet) {
    return res.status(404).json({
      success: false,
      message: 'Pet not found'
    });
  }

  pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Pet updated successfully',
    data: { pet }
  });
});

// @desc    Delete pet
// @route   DELETE /api/pets/:id
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

// @desc    Get available locations
// @route   GET /api/pets/locations
// @access  Public
exports.getLocations = asyncHandler(async (req, res) => {
  const locations = await Pet.distinct('location');

  res.status(200).json({
    success: true,
    data: { locations }
  });
});
