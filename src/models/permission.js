const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Permission = sequelize.define('Permission', {
  // Unique identifier for the permission
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  // Name of the permission (e.g., 'getorder', 'addorder')
  permission_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },

  // Description of the permission (optional)
  description: {
    type: DataTypes.TEXT,
    allowNull: true,  // Description can be null
  },
}, {
  tableName: 'permissions',  // Specifies the table name in the database
  timestamps: false,         // Disable automatic timestamps
});

module.exports = Permission;
