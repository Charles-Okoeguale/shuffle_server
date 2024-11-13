const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Role = sequelize.define('Role', {
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true, 
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  permissions: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: [],
  },

}, {
  tableName: 'roles', 
  timestamps: true,  
});

module.exports = Role;
