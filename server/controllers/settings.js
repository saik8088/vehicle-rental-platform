const Setting = require('../models/Setting');

// Helper to get or create settings
const getOrCreateSettings = async () => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }
  return settings;
};

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    
    // Only allow updating specific fields to prevent injecting `_id` or similar
    const fieldsToUpdate = {
      platformFee: req.body.platformFee,
      enableRegistration: req.body.enableRegistration,
      maintenanceMode: req.body.maintenanceMode,
      contactEmail: req.body.contactEmail,
      autoApproveVehicles: req.body.autoApproveVehicles
    };

    // Filter out undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const updatedSettings = await Setting.findByIdAndUpdate(
      settings._id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedSettings
    });
  } catch (err) {
    next(err);
  }
};
