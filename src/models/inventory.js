const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Inventory = sequelize.define('Inventory', {
  // Unique identifier for the inventory item
  id: {
    type: DataTypes.INTEGER,  
    primaryKey: true,          
  },

  // Name of the item
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  // Status of the item (e.g., 'pending')
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },

  // Tracking ID for shipment
  tracking_id: {
    type: DataTypes.STRING(50),
    allowNull: true,  // Tracking ID may not be present for every item
  },

  // Unit of measurement (e.g., 'Pieces')
  unit: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },

  // Quantity of the item in inventory
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  // Price per unit of the item
  unit_price: {
    type: DataTypes.DECIMAL(12, 2), // Handle price with two decimal places
    allowNull: false,
  },

  // Date of payment (e.g., '24-05-2012')
  date_of_payment: {
    type: DataTypes.STRING(20),  // Using STRING for date to match format you provided
    allowNull: false,
  },

  // Shipping fee for the item
  shipping_fee: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },

  // Total amount paid (including shipping fees)
  total_paid: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },

  // Shipping fee to Nigeria
  shipping_fee_to_nigeria: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },

  // Date of delivery (e.g., '23-09-2014')
  date_of_delivery: {
    type: DataTypes.STRING(20),
    allowNull: true,  // Delivery date might be unknown for items still pending
  },
}, {
  tableName: 'inventory', 
  timestamps: true,    
});

module.exports = Inventory;
