const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String },
  semester: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
