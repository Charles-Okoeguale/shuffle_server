const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Permission = sequelize.define('Permission', {

  // Name of the permission (e.g., 'Inventory', 'User', etc.)
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,  // Ensure permission names are unique
  },

  // The 'can' field is now JSONB to store the permission structure
  can: {
    type: DataTypes.JSONB,  // Store the permissions (add, edit, delete) as JSON
    allowNull: false,  // This is required
    defaultValue: { add: false, edit: false, delete: false } // Default permission structure
  },

}, {
  tableName: 'permissions',  // Specifies the table name in the database
  timestamps: false,  // Disable automatic timestamps for this model
});

module.exports = Permission;
