const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    mobile: Number,
    course: String,
    semester: String,
    designation: String,
    department: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'student' },
    hireDate: { type: Date }, // <-- Added hire date field
    enrollmentNo:String
});

// Prevent model overwrite error in development
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
