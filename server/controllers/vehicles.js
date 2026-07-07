const Vehicle = require('../models/Vehicle');
const cloudinary = require('../config/cloudinary');
const Setting = require('../models/Setting');
const { createNotification } = require('./notificationController');

// @desc    Get all vehicles (public — only available ones)
// @route   GET /api/vehicles
// @access  Public
exports.getVehicles = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };

    // Fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    const filterObj = JSON.parse(queryStr);
    // Public endpoint only returns available and approved vehicles
    filterObj.isAvailable = true;
    filterObj.approvalStatus = 'approved';

    query = Vehicle.find(filterObj).populate({
      path: 'provider',
      select: 'name email phone'
    });

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;
    const total = await Vehicle.countDocuments(filterObj);

    query = query.skip(startIndex).limit(limit).sort({ createdAt: -1 });

    const vehicles = await query;

    res.status(200).json({
      success: true,
      count: vehicles.length,
      pagination: { total, page, pages: Math.ceil(total / limit) },
      data: vehicles
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get provider's own vehicles
// @route   GET /api/vehicles/my
// @access  Private (Provider)
exports.getMyVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ provider: req.user.id })
      .populate({ path: 'provider', select: 'name email phone' })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Public
exports.getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate({
      path: 'provider',
      select: 'name email phone'
    });

    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new vehicle (with Cloudinary image upload)
// @route   POST /api/vehicles
// @access  Private (Provider)
exports.createVehicle = async (req, res, next) => {
  try {
    req.body.provider = req.user.id;

    // Handle image uploads
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'rideeasy/vehicles',
          transformation: [{ width: 1200, height: 800, crop: 'fill', quality: 'auto' }]
        });
        images.push({ url: result.secure_url, publicId: result.public_id });
      }
    }

    // Parse features from comma-separated string
    if (typeof req.body.features === 'string') {
      req.body.features = req.body.features.split(',').map(f => f.trim()).filter(Boolean);
    }

    req.body.images = images;
    const settings = await Setting.findOne();
    req.body.approvalStatus = (settings && settings.autoApproveVehicles) ? 'approved' : 'pending';

    const vehicle = await Vehicle.create(req.body);

    // Notify provider
    await createNotification(
      req.user.id,
      'Vehicle Listed Successfully',
      `Your vehicle "${vehicle.name}" is now live and visible to customers.`,
      'success'
    );

    res.status(201).json({
      success: true,
      data: vehicle
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Provider, Admin)
exports.updateVehicle = async (req, res, next) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    // Make sure user is vehicle owner or admin
    if (vehicle.provider.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to update this vehicle' });
    }

    // Handle new image uploads if any
    if (req.files && req.files.length > 0) {
      const newImages = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'rideeasy/vehicles',
          transformation: [{ width: 1200, height: 800, crop: 'fill', quality: 'auto' }]
        });
        newImages.push({ url: result.secure_url, publicId: result.public_id });
      }
      // Append new images to existing ones
      req.body.images = [...(vehicle.images || []), ...newImages].slice(0, 5);
    }

    // Parse features
    if (typeof req.body.features === 'string') {
      req.body.features = req.body.features.split(',').map(f => f.trim()).filter(Boolean);
    }

    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete vehicle (clean up Cloudinary images)
// @route   DELETE /api/vehicles/:id
// @access  Private (Provider, Admin)
exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    // Make sure user is vehicle owner or admin
    if (vehicle.provider.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this vehicle' });
    }

    // Delete images from Cloudinary
    if (vehicle.images && vehicle.images.length > 0) {
      for (const img of vehicle.images) {
        if (img.publicId) {
          try {
            await cloudinary.uploader.destroy(img.publicId);
          } catch (e) {
            console.error('Cloudinary cleanup failed for', img.publicId);
          }
        }
      }
    }

    await vehicle.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
