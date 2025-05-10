// controllers/attendanceController.js
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Create Attendance (teacher/admin only)
exports.createAttendance = async (req, res) => {
  if (!['teacher', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ msg: 'Only teacher or admin can mark attendance' });
  }

  let records = req.body;
  if (!Array.isArray(records)) {
    records = [records];
  }

  try {
    for (let rec of records) {
      const student = await User.findById(rec.studentId);
      if (!student || student.role !== 'student') {
        return res.status(400).json({ msg: `Invalid studentId: ${rec.studentId}` });
      }
    }

    const created = await Attendance.insertMany(records);
    res.status(201).json({ msg: `${created.length} attendance(s) marked successfully`, attendances: created });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get all attendances (admin/teacher → all, student → only own)
exports.getAllAttendances = async (req, res) => {
  try {
    let filter = {};

    // If student → filter by own userId
    if (req.user.role === 'student') {
      filter = { studentId: req.user.id };
    }

    const attendances = await Attendance.find(filter)
      .populate('studentId', 'firstname lastname email')
      .populate('subjectId', 'name');

    res.json(attendances);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching attendances' });
  }
};

// Get single attendance (admin/teacher can get any; student only own)
exports.getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('studentId', 'firstname lastname email')
      .populate('subjectId', 'name');

    if (!attendance) return res.status(404).json({ msg: 'Attendance not found' });

    // If student and trying to access other's attendance → block
    if (req.user.role === 'student' && attendance.studentId._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized to view this attendance record' });
    }

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching attendance' });
  }
};

// Update attendance (teacher/admin only)
exports.updateAttendance = async (req, res) => {
  if (!['teacher', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ msg: 'Only teacher or admin can update attendance' });
  }

  try {
    const updated = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ msg: 'Attendance not found' });

    res.json({ msg: 'Attendance updated successfully', attendance: updated });
  } catch (err) {
    res.status(500).json({ msg: 'Error updating attendance' });
  }
};

// Delete attendance (teacher/admin only)
exports.deleteAttendance = async (req, res) => {
  if (!['teacher', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ msg: 'Only teacher or admin can delete attendance' });
  }

  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Attendance deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting attendance' });
  }
};
