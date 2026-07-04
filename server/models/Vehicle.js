const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a vehicle name'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand']
  },
  type: {
    type: String,
    enum: ['car', 'bike', 'scooter'],
    required: true
  },
  transmission: {
    type: String,
    enum: ['manual', 'automatic'],
    required: true
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'hybrid'],
    required: true
  },
  seats: {
    type: Number,
    required: true
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Please add a price per day']
  },
  pricePerHour: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    required: [true, 'Please add a location (City/Area)']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  features: {
    type: [String],
    default: []
  },
  images: [{
    url: String,
    publicId: String
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  averageRating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
