const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Import the Sequelize instance

const Role = sequelize.define('Role', {
  // Unique identifier for the role
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  // Name of the role (e.g., 'Product Sorter')
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true, // Ensure role names are unique
  },

  // Description of the role
  description: {
    type: DataTypes.TEXT,
    allowNull: true, // Description can be null
  },

  // Permissions associated with the role
  permissions: {
    type: DataTypes.JSONB, // Use JSONB to store an array of permissions
    allowNull: false,
    defaultValue: [], // Default to an empty array if no permissions are provided
  },
}, {
  tableName: 'roles', // Specifies the table name in the database
  timestamps: false,  // Disable automatic timestamps
});

module.exports = Role;
