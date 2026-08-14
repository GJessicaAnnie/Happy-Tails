const mongoose = require('mongoose');

const adoptionApplicationSchema = new mongoose.Schema({
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Step 1 - Personal Details
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  addressLine1: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  occupation: {
    type: String,
    required: [true, 'Occupation is required'],
    trim: true
  },
  
  // Step 2 - Living Situation
  livingSituation: {
    type: String,
    required: [true, 'Living situation is required'],
    enum: ['Alone', 'Family', 'Roommates']
  },
  familyApproval: {
    type: String,
    required: [true, 'Family approval is required'],
    enum: ['Yes', 'No']
  },
  houseType: {
    type: String,
    required: [true, 'House type is required'],
    enum: ['Own', 'Rented']
  },
  landlordPermission: {
    type: String,
    enum: ['Yes', 'No']
  },
  priorPetExperience: {
    type: String,
    required: [true, 'Prior pet experience is required'],
    enum: ['Yes', 'No']
  },
  dailyWalkCommitment: {
    type: String,
    required: [true, 'Daily walk commitment is required'],
    enum: ['1-2 hours', '2-4 hours', '4+ hours']
  },
  hoursPetAlone: {
    type: String,
    required: [true, 'Hours pet alone is required'],
    enum: ['0-2 hours', '2-6 hours', '6+ hours']
  },
  backupCaretaker: {
    type: String,
    required: [true, 'Backup caretaker is required'],
    trim: true
  },
  
  // Step 3 - Pet Care Readiness
  adoptionReason: {
    type: String,
    required: [true, 'Adoption reason is required'],
    trim: true
  },
  financialReadiness: {
    type: String,
    required: [true, 'Financial readiness is required'],
    enum: ['Yes', 'No']
  },
  vetAccess: {
    type: String,
    required: [true, 'Vet access is required'],
    enum: ['Yes', 'No']
  },
  agreeToCare: {
    type: Boolean,
    required: [true, 'You must agree to care for the pet']
  },
  
  // Application status
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewNotes: {
    type: String,
    trim: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date
}, {
  timestamps: true
});

// Index for faster queries
adoptionApplicationSchema.index({ userId: 1, status: 1 });
adoptionApplicationSchema.index({ petId: 1, status: 1 });

module.exports = mongoose.model('AdoptionApplication', adoptionApplicationSchema);
