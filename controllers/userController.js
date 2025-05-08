// controllers/userController.js
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');

// Create User (Only Admin)2332222
exports.createUser = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Only admin can create users' });
  }

  let users = req.body;

  // Allow single object or array
  if (!Array.isArray(users)) {
    users = [users]; // Wrap single object into array
  }

  // Check if all roles are valid
  const invalidRole = users.some(user => !['teacher', 'student'].includes(user.role));
  if (invalidRole) {
    return res.status(400).json({ msg: 'Invalid role found. Role must be teacher or student.' });
  }

  try {
    // Check for duplicate email/username in DB (any of them)
    const emails = users.map(u => u.email);
    const usernames = users.map(u => u.username);
    const existing = await User.find({ $or: [{ email: { $in: emails } }, { username: { $in: usernames } }] });

    if (existing.length > 0) {
      const duplicates = existing.map(e => ({ email: e.email, username: e.username }));
      return res.status(400).json({ msg: 'Email or username already in use', duplicates });
    }

    // Hash passwords and build user objects
    const hashedUsers = await Promise.all(
      users.map(async (u) => {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        return {
          firstname: u.firstname,
          lastname: u.lastname,
          mobile: u.mobile,
          course: u.course,
          semester: u.semester,
          designation: u.designation,
          department: u.department,
          username: u.username,
          email: u.email,
          password: hashedPassword,
          role: u.role,
          hireDate: u.hireDate
        };
      })
    );

    // Insert all users at once
    const createdUsers = await User.insertMany(hashedUsers);

    res.status(201).json({ msg: `${createdUsers.length} user(s) created successfully`, users: createdUsers });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching users' });
  }
};

// Get single user
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching user' });
  }
};

// Update user (admin or user himself)
exports.updateUser = async (req, res) => {
  const {
    firstname,
    lastname,
    mobile,
    course,
    semester,
    designation,
    department,
    username,
    email,
    role,
    hireDate,
    password,
    name // for users who have 'name' directly like admin
  } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Check permission (only admin or the same user can update)
    if (req.user.role !== 'admin' && req.user.id !== user.id.toString()) {
      return res.status(403).json({ msg: 'Unauthorized to update user' });
    }

    // Update all possible fields if provided
    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.mobile = mobile || user.mobile;
    user.course = course || user.course;
    user.semester = semester || user.semester;
    user.designation = designation || user.designation;
    user.department = department || user.department;
    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    user.hireDate = hireDate || user.hireDate;
    user.name = name || user.name; // For admin-type users

    if (password) {
      const bcrypt = require('bcryptjs'); // Ensure this is imported
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({ msg: 'User updated successfully', user });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ msg: 'Error updating user' });
  }
};


// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Only admin can delete users' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting user' });
  }
};
