const { User } = require('./user');  // Assuming user model is in the user.js file
const { Statistics } = require('./statistics');  // Assuming statistics model is in the statistics.js file
const Inventory = require('./inventory');
const Permission = require('./permission');
const RolePermission = require('./rolePermission');
const Role = require('./role');

// You can add additional model imports as needed

module.exports = {
  User,
  Statistics,
  Inventory,
  Permission,
  RolePermission,
  Role
  // Export other models here as well
};
