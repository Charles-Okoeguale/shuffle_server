module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('orders', {
      fields: ['tracking_id'],
      type: 'unique',
      name: 'unique_tracking_id_constraint',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('orders', 'unique_tracking_id_constraint');
  }
};