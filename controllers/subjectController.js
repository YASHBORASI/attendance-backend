const Subject = require('../models/Subject');

// Create Subject (admin only)
exports.createSubject = async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ msg: 'Only admin can create subjects' });
  }

  const { subject, course, credit } = req.body;

  try {
    const newSubject = new Subject({ subject, course, credit });
    await newSubject.save();
    res.status(201).json({ msg: 'Subject created successfully', subject: newSubject });
  } catch (err) {
    res.status(500).json({ msg: 'Error creating subject', error: err.message });
  }
};

// Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching subjects' });
  }
};

// Get subject by ID
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ msg: 'Subject not found' });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching subject' });
  }
};

// Update subject
exports.updateSubject = async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ msg: 'Only teacher can update subjects' });
  }

  const { subject, course, credit } = req.body;

  try {
    const sub = await Subject.findById(req.params.id);
    if (!sub) return res.status(404).json({ msg: 'Subject not found' });

    sub.subject = subject || sub.subject;
    sub.course = course || sub.course;
    sub.credit = credit || sub.credit;

    await sub.save();
    res.json({ msg: 'Subject updated successfully', subject: sub });
  } catch (err) {
    res.status(500).json({ msg: 'Error updating subject' });
  }
};

// Delete subject
exports.deleteSubject = async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ msg: 'Only admin can delete subjects' });
  }

  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Subject deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting subject' });
  }
};
