const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Import the Sequelize instance

const defaultPermissions = [
  {
    name: "Inventory",
    can: { add: false, edit: false, delete: false }
  },
  {
    name: "User",
    can: { add: false, edit: false, delete: false }
  },
  {
    name: "Statistics",
    can: { add: false, edit: false, delete: false }
  },
  {
    name: "Role",
    can: { add: false, edit: false, delete: false }
  }
];

const Role = sequelize.define('Role', {
  // Name of the role (e.g., 'Manager', 'Admin')
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,  // Ensure role names are unique
  },

  // Description of the role
  description: {
    type: DataTypes.TEXT,
    allowNull: true,  // Description can be null
  },

  // Permissions associated with the role (JSONB)
  permissions: {
    type: DataTypes.JSONB,  // Store the permissions as a JSONB object
    allowNull: false,
    defaultValue: defaultPermissions,  // Set the default permissions if none are provided
  },

}, {
  tableName: 'roles',  // Specifies the table name in the database
  timestamps: true,    // Enable timestamps to track role creation time
});

module.exports = Role;
