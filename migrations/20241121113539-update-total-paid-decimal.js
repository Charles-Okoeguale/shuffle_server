module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('inventory', 'total_paid', {
      type: Sequelize.DECIMAL(20, 2),
    });
    await queryInterface.changeColumn('users', 'total_spent', {
      type: Sequelize.DECIMAL(20, 2),
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes if necessary
    await queryInterface.changeColumn('inventory', 'total_paid', {
      type: Sequelize.DECIMAL(12, 2),
    });
    await queryInterface.changeColumn('users', 'total_spent', {
      type: Sequelize.DECIMAL(12, 2),
    });
  }
};
