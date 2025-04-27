const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  course: { type: String, required: true },  // or ObjectId if referencing a Course model
  credit: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
