// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Authenticated routes
router.post('/', protect, userController.createUser);         // Create user (admin only)
router.get('/', protect, userController.getAllUsers);        // List all users
router.get('/:id', protect, userController.getUserById);     // Get single user
router.put('/:id', protect, userController.updateUser);      // Update user
router.delete('/:id', protect, userController.deleteUser);   // Delete user (admin only)

module.exports = router;


// /api/users  -- create