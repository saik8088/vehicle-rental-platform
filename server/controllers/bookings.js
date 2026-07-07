const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Setting = require('../models/Setting');
const { createNotification } = require('./notificationController');

// @desc    Get all bookings (role-based)
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === 'admin') {
      query = Booking.find().populate({
        path: 'vehicle customer provider',
        select: 'name email type pricePerDay images location'
      });
    } else if (req.user.role === 'provider') {
      query = Booking.find({ provider: req.user.id }).populate({
        path: 'vehicle customer',
        select: 'name email type pricePerDay images location'
      });
    } else {
      query = Booking.find({ customer: req.user.id }).populate({
        path: 'vehicle provider',
        select: 'name email type pricePerDay images location'
      });
    }

    let bookings = await query.sort({ createdAt: -1 });

    // Auto-complete: mark bookings as 'completed' if endDate has passed and status is 'upcoming' or 'active'
    const now = new Date();
    for (let booking of bookings) {
      if (['upcoming', 'active'].includes(booking.status) && new Date(booking.endDate) < now) {
        booking.status = 'completed';
        await booking.save();
      }
      // Auto-activate: mark 'upcoming' bookings as 'active' if startDate has passed
      if (booking.status === 'upcoming' && new Date(booking.startDate) <= now && new Date(booking.endDate) >= now) {
        booking.status = 'active';
        await booking.save();
      }
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Check vehicle availability for dates
// @route   POST /api/bookings/check-availability
// @access  Public
exports.checkAvailability = async (req, res, next) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;

    if (!vehicleId || !startDate || !endDate) {
      return res.status(400).json({ success: false, error: 'vehicleId, startDate, and endDate are required' });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    if (!vehicle.isAvailable) {
      return res.status(200).json({ success: true, available: false, reason: 'Vehicle is currently marked as unavailable by the owner.' });
    }

    // Check for overlapping bookings (not cancelled)
    const overlap = await Booking.findOne({
      vehicle: vehicleId,
      status: { $nin: ['cancelled', 'completed'] },
      $or: [
        { startDate: { $lt: new Date(endDate) }, endDate: { $gt: new Date(startDate) } }
      ]
    });

    if (overlap) {
      const formatOpts = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return res.status(200).json({
        success: true,
        available: false,
        reason: `Vehicle is booked from ${overlap.startDate.toLocaleString('en-IN', formatOpts)} to ${overlap.endDate.toLocaleString('en-IN', formatOpts)}.`
      });
    }

    res.status(200).json({ success: true, available: true });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Customer)
exports.createBooking = async (req, res, next) => {
  try {
    // Check maintenance mode
    const settings = await Setting.findOne();
    if (settings && settings.maintenanceMode) {
      return res.status(503).json({ success: false, error: 'The platform is currently in maintenance mode. Booking is temporarily disabled.' });
    }

    req.body.customer = req.user.id;

    const vehicle = await Vehicle.findById(req.body.vehicle);

    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    // Check date overlap
    const overlap = await Booking.findOne({
      vehicle: req.body.vehicle,
      status: { $nin: ['cancelled', 'completed'] },
      $or: [
        { startDate: { $lt: new Date(req.body.endDate) }, endDate: { $gt: new Date(req.body.startDate) } }
      ]
    });

    if (overlap) {
      return res.status(400).json({ success: false, error: 'Vehicle is already booked for the selected dates.' });
    }

    // Calculate total price server-side
    const start = new Date(req.body.startDate);
    const end = new Date(req.body.endDate);
    
    let totalPrice = 0;
    const diffInMs = end - start;
    if (diffInMs > 0) {
      const totalHours = Math.ceil(diffInMs / (1000 * 60 * 60));
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;
      
      let subtotal = 0;
      if (vehicle.pricePerHour && totalHours < 24) {
        subtotal = totalHours * vehicle.pricePerHour;
      } else {
        subtotal = days * vehicle.pricePerDay;
        if (hours > 0) {
          if (vehicle.pricePerHour) {
            subtotal += hours * vehicle.pricePerHour;
          } else {
            subtotal += (hours / 24) * vehicle.pricePerDay;
          }
        }
      }
      const feePercentage = settings ? settings.platformFee : 5;
      const serviceFee = Math.round(subtotal * (feePercentage / 100));
      totalPrice = Math.round(subtotal + serviceFee);
    }

    req.body.provider = vehicle.provider;
    req.body.totalPrice = totalPrice;

    const booking = await Booking.create(req.body);

    // Notify customer
    await createNotification(
      req.user.id,
      'Booking Confirmed!',
      `Your booking for "${vehicle.name}" from ${start.toLocaleDateString()} to ${end.toLocaleDateString()} has been confirmed. Total: ₹${totalPrice.toLocaleString('en-IN')}.`,
      'success'
    );

    // Notify provider
    await createNotification(
      vehicle.provider,
      'New Booking Received!',
      `Your vehicle "${vehicle.name}" has been booked by ${req.user.name} (Phone: ${req.user.phone || 'N/A'}) from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}. Earnings: ₹${totalPrice.toLocaleString('en-IN')}.`,
      'info'
    );

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update booking status (cancel / complete)
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id)
      .populate('vehicle', 'name')
      .populate('customer', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // Authorization check
    if (
      booking.customer._id.toString() !== req.user.id && 
      booking.provider.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this booking' });
    }

    const prevStatus = booking.status;

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('vehicle', 'name').populate('customer', 'name email phone');

    // Send notifications on status changes
    const vehicleName = booking.vehicle?.name || 'your vehicle';

    if (req.body.status === 'cancelled' && prevStatus !== 'cancelled') {
      await createNotification(
        booking.customer,
        'Booking Cancelled',
        `Your booking for "${vehicleName}" has been cancelled.`,
        'warning'
      );
      await createNotification(
        booking.provider,
        'Booking Cancelled',
        `A booking for "${vehicleName}" has been cancelled by the customer.`,
        'warning'
      );
      
      // If cancelled before start, notify admins for refund processing
      if (new Date(booking.startDate) > new Date() && booking.totalPrice > 0) {
        const User = require('../models/User');
        const admins = await User.find({ role: 'admin' });
        for (let admin of admins) {
          await createNotification(
            admin._id,
            'Refund Required',
            `Customer ${booking.customer.name} (${booking.customer.email}) cancelled booking for "${vehicleName}". Refund Amount: ₹${booking.totalPrice.toLocaleString('en-IN')}. Booking ID: ${booking._id}.`,
            'warning'
          );
        }
      }
    }

    if (req.body.status === 'completed' && prevStatus !== 'completed') {
      await createNotification(
        booking.customer,
        'Ride Completed!',
        `Your ride with "${vehicleName}" is now completed. Thank you for using RideEasy!`,
        'success'
      );
      await createNotification(
        booking.provider,
        'Ride Completed',
        `The ride for "${vehicleName}" has been completed.`,
        'success'
      );
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};
