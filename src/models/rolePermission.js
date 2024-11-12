const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Import the Sequelize instance

const RolePermission = sequelize.define('RolePermission', {
  // Role-Permission relationship table
  role_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'roles',  // Refers to the roles table
      key: 'id',
    },
    allowNull: false,
  },

  permission_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'permissions',  // Refers to the permissions table
      key: 'id',
    },
    allowNull: false,
  },
}, {
  tableName: 'role_permissions',  // Specifies the table name in the database
  timestamps: false,              // Disable automatic timestamps
});

module.exports = RolePermission;
