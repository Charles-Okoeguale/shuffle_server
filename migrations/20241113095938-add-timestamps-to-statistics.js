module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('statistics', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW')
    });
    await queryInterface.addColumn('statistics', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW')
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('statistics', 'createdAt');
    await queryInterface.removeColumn('statistics', 'updatedAt');
  }
};
