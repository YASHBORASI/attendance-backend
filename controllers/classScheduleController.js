const ClassSchedule = require('../models/ClassSchedule');

// Create a class schedule (Teacher only)
exports.createClass = async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ msg: 'Only teachers can schedule classes' });
  }

  const { subject, date, startTime, endTime } = req.body;

  try {
    const newClass = new ClassSchedule({ subject, date, startTime, endTime });
    await newClass.save();
    res.status(201).json({ msg: 'Class scheduled successfully', classData: newClass });
  } catch (err) {
    res.status(500).json({ msg: 'Error scheduling class', error: err.message });
  }
};

// Get all scheduled classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await ClassSchedule.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching classes' });
  }
};

// Get a single scheduled class by ID
exports.getClassById = async (req, res) => {
  try {
    const classData = await ClassSchedule.findById(req.params.id);
    if (!classData) return res.status(404).json({ msg: 'Class not found' });
    res.json(classData);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching class' });
  }
};

// Update a scheduled class
exports.updateClass = async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ msg: 'Only teachers can update classes' });
  }

  const { subject, date, startTime, endTime } = req.body;

  try {
    const classData = await ClassSchedule.findById(req.params.id);
    if (!classData) return res.status(404).json({ msg: 'Class not found' });

    classData.subject = subject || classData.subject;
    classData.date = date || classData.date;
    classData.startTime = startTime || classData.startTime;
    classData.endTime = endTime || classData.endTime;

    await classData.save();
    res.json({ msg: 'Class updated successfully', classData });
  } catch (err) {
    res.status(500).json({ msg: 'Error updating class' });
  }
};

// Delete a scheduled class
exports.deleteClass = async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ msg: 'Only teachers can delete classes' });
  }

  try {
    await ClassSchedule.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Class deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting class' });
  }
};
