module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('inventory', 'card_charges', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00, // Default value for existing rows
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('inventory', 'card_charges');
  }
};