const bcrypt = require('bcryptjs');
const User = require('../models/user');
async function addAdminUser() {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash('password', 10); // Use a salt rounds value of 10
  
      // Create the admin user
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
  
  // Call the function to create the admin user
  addAdminUser();