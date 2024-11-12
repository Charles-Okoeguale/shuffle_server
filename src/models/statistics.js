const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Import the Sequelize instance

const Statistic = sequelize.define('Statistic', {
  // Unique identifier for the statistic
  stat_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  // The name of the statistic (e.g., 'total_spent', 'num_employees', etc.)
  stat_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true, // Ensures no duplicate statistic names
  },

  // The value of the statistic (e.g., total amount spent, number of employees, etc.)
  value: {
    type: DataTypes.DECIMAL(12, 2), // NUMERIC with 2 decimal places
    allowNull: false,
  },

}, {
  tableName: 'statistics',  // Specifies the table name in the database
  timestamps: false, // We handle the `updated_at` manually (not automatic timestamps)
});

module.exports = Statistic;
