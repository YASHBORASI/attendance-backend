const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const User = require('./models/user');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const subjectRoutes = require('./routes/subjectRoutes');



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('✅ MongoDB connected');

    // Ensure admin user exists
    const existingAdmin = await User.findOne({ username: 'yash@123' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('yash@123', 10);

      const adminUser = new User({
        name: 'Yash Borasi',
        username: 'yash@123',
        email: 'yborasi44580@gmail.com',
        password: hashedPassword,
        role: 'admin',
      });

      await adminUser.save();
      console.log('🛡️ Admin user created');
    } else {
      console.log('🔐 Admin user already exists');
    }

    // Initialize middleware after DB connection
  

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/course', courseRoutes);
    app.use('/api/subjects',subjectRoutes)

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

module.exports = app;
