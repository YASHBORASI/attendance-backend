const mongoose = require('mongoose');

const classScheduleSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.models.ClassSchedule || mongoose.model('ClassSchedule', classScheduleSchema);
