const express = require('express');
const {
  getBookings,
  createBooking,
  updateBooking,
  checkAvailability
} = require('../controllers/bookings');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/check-availability', checkAvailability);

router
  .route('/')
  .get(protect, getBookings)
  .post(protect, authorize('customer'), createBooking);

router
  .route('/:id')
  .put(protect, updateBooking);

module.exports = router;
