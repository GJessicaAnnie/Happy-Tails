const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true
  },
  breed: {
    type: String,
    required: [true, 'Breed is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Pet type is required'],
    enum: ['dog', 'cat', 'bird', 'rabbit', 'other']
  },
  age: {
    type: String,
    required: [true, 'Age is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Pet image is required']
  },
  description: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  vaccinated: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'adopted'],
    default: 'available'
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better search performance
petSchema.index({ name: 'text', breed: 'text' });
petSchema.index({ type: 1, location: 1, status: 1 });

module.exports = mongoose.model('Pet', petSchema);
