const Course = require('../models/Course');

// Create Course (Admin only)
exports.createCourse = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Only admin can create courses' });
  }

  const { name, code, description, semester } = req.body;

  try {
    const existing = await Course.findOne({ code });
    if (existing) return res.status(400).json({ msg: 'Course code already exists' });

    const course = new Course({ name, code, description, semester });
    await course.save();

    res.status(201).json({ msg: 'Course created successfully', course });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching courses' });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching course' });
  }
};

// Update course (Admin only)
exports.updateCourse = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Only admin can update courses' });
  }

  const { name, code, description, semester } = req.body;

  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    course.name = name || course.name;
    course.code = code || course.code;
    course.description = description || course.description;
    course.semester = semester || course.semester;

    await course.save();

    res.json({ msg: 'Course updated successfully', course });
  } catch (err) {
    res.status(500).json({ msg: 'Error updating course' });
  }
};

// Delete course (Admin only)
exports.deleteCourse = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Only admin can delete courses' });
  }

  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting course' });
  }
};
