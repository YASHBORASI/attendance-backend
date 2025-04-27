const express = require('express');
const router = express.Router();
const classScheduleController = require('../controllers/classScheduleController');
const { protect } = require('../middleware/authMiddleware');

// Routes
router.post('/', protect, classScheduleController.createClass);         // Schedule a class
router.get('/', protect, classScheduleController.getAllClasses);        // Get all classes
router.get('/:id', protect, classScheduleController.getClassById);      // Get class by ID
router.put('/:id', protect, classScheduleController.updateClass);       // Update a class
router.delete('/:id', protect, classScheduleController.deleteClass);    // Delete a class

module.exports = router;
