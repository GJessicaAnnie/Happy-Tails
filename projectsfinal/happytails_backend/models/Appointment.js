const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  vetName: {
    type: String,
    required: [true, 'Veterinarian name is required']
  },
  vetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required']
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true
  },
  petName: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true
  },
  petType: {
    type: String,
    required: [true, 'Pet type is required'],
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other']
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  reason: {
    type: String,
    required: [true, 'Reason for visit is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound index to prevent double booking
appointmentSchema.index({ vetId: 1, date: 1, timeSlot: 1 }, { unique: true });
appointmentSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
