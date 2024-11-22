const bcrypt = require('bcryptjs');
const User = require('../models/user');

async function addAdminUser() {
  try {
    const existingAdmin = await User.findOne({
      where: {
        email: 'chris@shufflelocalmarket.com',
        role: 'admin',
      },
    });

    if (existingAdmin) {
      console.log('Admin user already exists. Skipping...');
      return;
    }

    const hashedPassword = await bcrypt.hash('password', 10);

    const adminUser = await User.create({
      firstname: 'Chris',
      lastname: 'Obika',
      email: 'chris@shufflelocalmarket.com',
      password_hash: hashedPassword,
      role: 'admin',
    });

    console.log('Admin user created successfully:', adminUser);
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
}

module.exports = addAdminUser;