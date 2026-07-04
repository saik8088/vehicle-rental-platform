const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
  try {
    let query;

    // Admin can see all bookings, customers see their own, providers see bookings for their vehicles
    if (req.user.role === 'admin') {
      query = Booking.find().populate({
        path: 'vehicle customer provider',
        select: 'name email type pricePerDay images'
      });
    } else if (req.user.role === 'provider') {
      query = Booking.find({ provider: req.user.id }).populate({
        path: 'vehicle customer',
        select: 'name email type pricePerDay images'
      });
    } else {
      query = Booking.find({ customer: req.user.id }).populate({
        path: 'vehicle provider',
        select: 'name email type pricePerDay images'
      });
    }

    const bookings = await query;

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Customer)
exports.createBooking = async (req, res, next) => {
  try {
    // Add customer to req.body
    req.body.customer = req.user.id;

    const vehicle = await Vehicle.findById(req.body.vehicle);

    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    // Set provider from vehicle
    req.body.provider = vehicle.provider;

    const booking = await Booking.create(req.body);

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // Make sure user is booking owner (to cancel) or provider/admin
    if (
      booking.customer.toString() !== req.user.id && 
      booking.provider.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this booking' });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};
