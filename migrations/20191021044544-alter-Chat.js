'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('Chats', 'type')
      await queryInterface.changeColumn('Chats', 'createdAt', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      })
      await queryInterface.changeColumn('Chats', 'updatedAt', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      })
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('Chats', 'type', {
        type: Sequelize.ENUM('Private', 'Group'),
        allowNull: false
      })
      await queryInterface.changeColumn('Chats', 'createdAt', {
        allowNull: false,
        type: Sequelize.DATE
      })
      await queryInterface.changeColumn('Chats', 'updatedAt', {
        allowNull: false,
        type: Sequelize.DATE
      })
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
};
