const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');

// Routes
router.post('/', protect, subjectController.createSubject);          // Create subject
router.get('/', protect, subjectController.getAllSubjects);         // Get all subjects
router.get('/:id', protect, subjectController.getSubjectById);      // Get single subject
router.put('/:id', protect, subjectController.updateSubject);       // Update subject
router.delete('/:id', protect, subjectController.deleteSubject);    // Delete subject

module.exports = router;
