const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserProfile, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getAllUsers);
router.put('/profile', protect, updateUserProfile);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
