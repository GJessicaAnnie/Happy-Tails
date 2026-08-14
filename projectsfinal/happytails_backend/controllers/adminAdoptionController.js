// Simple in-memory data for admin panel
let adoptions = [
  {
    id: 1,
    petName: "Buddy",
    userName: "Vishnupriya",
    status: "pending"
  },
  {
    id: 2,
    petName: "Whiskers",
    userName: "John Doe",
    status: "pending"
  },
  {
    id: 3,
    petName: "Max",
    userName: "Jane Smith",
    status: "pending"
  }
];

// @desc    Get all adoption requests
// @route   GET /api/admin/adoptions
// @access  Public (for simplicity)
exports.getAdoptions = (req, res) => {
  res.status(200).json(adoptions);
};

// @desc    Approve adoption request
// @route   PUT /api/admin/adoptions/:id/approve
// @access  Public (for simplicity)
exports.approveAdoption = (req, res) => {
  const { id } = req.params;
  const adoptionIndex = adoptions.findIndex(adoption => adoption.id === parseInt(id));

  if (adoptionIndex === -1) {
    return res.status(404).json({ message: 'Adoption request not found' });
  }

  adoptions[adoptionIndex].status = 'approved';

  res.status(200).json({
    message: 'Adoption approved successfully',
    adoption: adoptions[adoptionIndex]
  });
};

// @desc    Reject adoption request
// @route   PUT /api/admin/adoptions/:id/reject
// @access  Public (for simplicity)
exports.rejectAdoption = (req, res) => {
  const { id } = req.params;
  const adoptionIndex = adoptions.findIndex(adoption => adoption.id === parseInt(id));

  if (adoptionIndex === -1) {
    return res.status(404).json({ message: 'Adoption request not found' });
  }

  adoptions[adoptionIndex].status = 'rejected';

  res.status(200).json({
    message: 'Adoption rejected successfully',
    adoption: adoptions[adoptionIndex]
  });
};