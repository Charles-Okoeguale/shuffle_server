const { DataTypes, Sequelize, UUIDV4} = require('sequelize');
const sequelize = require('../config/sequelize'); 

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total_spent: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
