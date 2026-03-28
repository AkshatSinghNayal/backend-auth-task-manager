require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const emailArg = process.argv[2];
const email = emailArg ? emailArg.trim().toLowerCase() : '';

if (!email) {
  console.error('Usage: npm run make-admin -- <email>');
  process.exit(1);
}

const promoteUserToAdmin = async () => {
  try {
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`User not found for email: ${email}`);
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`User is already admin: ${email}`);
      process.exit(0);
    }

    user.role = 'admin';
    await user.save();

    console.log(`User promoted to admin: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error(`Failed to promote user: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

promoteUserToAdmin();
