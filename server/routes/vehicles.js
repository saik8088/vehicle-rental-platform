const express = require('express');
const multer = require('multer');
const path = require('path');
const os = require('os');
const {
  getVehicles,
  getVehicle,
  getMyVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicles');
const { protect, authorize } = require('../middleware/auth');

// Multer config — store files temporarily before Cloudinary upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    cb(null, `vehicle-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB max

const router = express.Router();

// Provider's own vehicles (must be before /:id)
router.get('/my', protect, authorize('provider', 'admin'), getMyVehicles);

router
  .route('/')
  .get(getVehicles)
  .post(protect, authorize('provider', 'admin'), upload.array('images', 5), createVehicle);

router
  .route('/:id')
  .get(getVehicle)
  .put(protect, authorize('provider', 'admin'), upload.array('images', 5), updateVehicle)
  .delete(protect, authorize('provider', 'admin'), deleteVehicle);

module.exports = router;
