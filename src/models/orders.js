const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  tracking_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensures unique tracking_id in the table
    validate: {
      notEmpty: {
        msg: 'Tracking ID cannot be empty',
      },
    },
  },
  shipping_mark: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Shipping Mark cannot be empty',
      },
    },
  },
  status: {
    type: DataTypes.ENUM('delivered', 'no match', 'pending'),
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: {
        args: [['delivered', 'no match', 'pending']],
        msg: 'Invalid status value',
      },
    },
  },
}, {
  tableName: 'orders',
  timestamps: true, // Enables createdAt and updatedAt
});

module.exports = Order;
