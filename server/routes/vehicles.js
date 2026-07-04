const express = require('express');
const {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicles');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getVehicles)
  .post(protect, authorize('provider', 'admin'), createVehicle);

router
  .route('/:id')
  .get(getVehicle)
  .put(protect, authorize('provider', 'admin'), updateVehicle)
  .delete(protect, authorize('provider', 'admin'), deleteVehicle);

module.exports = router;
