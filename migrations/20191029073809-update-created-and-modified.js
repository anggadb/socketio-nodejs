'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.changeColumn('Users', 'createdAt', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      })
      await queryInterface.changeColumn('Users', 'updatedAt', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      })
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.changeColumn('Chatrooms', 'createdAt', {
        allowNull: false,
        type: Sequelize.DATE,
      })
      await queryInterface.changeColumn('Chatrooms', 'updatedAt', {
        allowNull: false,
        type: Sequelize.DATE,
      })
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }
};
