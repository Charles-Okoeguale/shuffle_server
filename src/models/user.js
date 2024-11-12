const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/sequelize'); // Import the Sequelize instance

const User = sequelize.define('User', {
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensures that no two users can have the same username
  },

  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensures that no two users can have the same username
  },

  // Unique email for the user
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensures that no two users can have the same email
  },

  // Hashed password field
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // The role of the user (admin, user, etc.)
  role: {
    type: DataTypes.ENUM('admin', 'product sorter', 'inventory manager', 'developer'), // You can add more roles as needed
    allowNull: false,
  },

}, {
  tableName: 'users', // Specifies the table name in the database
  timestamps: true,  // Disable automatic 'createdAt' and 'updatedAt' columns
});

module.exports = User;
