const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  content: {
    type: String,
    required: [true, 'Please add a review text']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate average rating for a vehicle after a new review
reviewSchema.statics.getAverageRating = async function(vehicleId) {
  const obj = await this.aggregate([
    {
      $match: { vehicle: vehicleId }
    },
    {
      $group: {
        _id: '$vehicle',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  try {
    if (obj[0]) {
      await this.model('Vehicle').findByIdAndUpdate(vehicleId, {
        averageRating: Math.round(obj[0].averageRating * 10) / 10,
        reviewCount: obj[0].reviewCount
      });
    } else {
      await this.model('Vehicle').findByIdAndUpdate(vehicleId, {
        averageRating: 0,
        reviewCount: 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.vehicle);
});

// Call getAverageRating before remove
reviewSchema.pre('remove', function() {
  this.constructor.getAverageRating(this.vehicle);
});

module.exports = mongoose.model('Review', reviewSchema);
