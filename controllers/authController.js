const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Old Functionality 

//exports.login = async (req, res) => {
//   const { username, password, role } = req.body;

//   const user = await User.findOne({ username });
//   if (!user) return res.status(404).json({ msg: 'User not found' });

//   const isMatch = await bcrypt.compare(password, user.password);
//   const isRoleMatched = user.role === role
//   if (!isMatch || !isRoleMatched) return res.status(401).json({ msg: 'Invalid credentials' });

//   const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//     expiresIn: '1d',
//   });
//   res.json({ token, user: { id: user._id, role: user.role } });
// };//
 
// New Functionality added by sagar
exports.login = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid password' }); // 👈 Specific message
    }

    const isRoleMatched = user.role === role;
    if (!isRoleMatched) {
      return res.status(401).json({ msg: 'Invalid role' }); // 👈 Optional, depending on UX
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};
