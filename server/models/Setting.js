const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  platformFee: {
    type: Number,
    required: true,
    default: 5,
    min: 0,
    max: 100
  },
  enableRegistration: {
    type: Boolean,
    required: true,
    default: true
  },
  maintenanceMode: {
    type: Boolean,
    required: true,
    default: false
  },
  contactEmail: {
    type: String,
    required: true,
    default: 'support@rideeasy.com'
  },
  autoApproveVehicles: {
    type: Boolean,
    required: true,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Setting', SettingSchema);
