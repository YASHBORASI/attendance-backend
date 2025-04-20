const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

// Routes
router.post('/', protect, courseController.createCourse);          // Create
router.get('/', protect, courseController.getAllCourses);         // Read All
router.get('/:id', protect, courseController.getCourseById);      // Read One
router.put('/:id', protect, courseController.updateCourse);       // Update
router.delete('/:id', protect, courseController.deleteCourse);    // Delete

module.exports = router;