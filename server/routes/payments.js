const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/payments');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;
