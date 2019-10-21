'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try{
      await queryInterface.changeColumn('Chatrooms', 'type', {
      type: Sequelize.ENUM('Private', 'Group'),
      allowNull: false,
      defaultValue: 'Private'
    });
      await queryInterface.changeColumn('Chatrooms', 'createdAt', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now')
    });
      await queryInterface.changeColumn('Chatrooms', 'updatedAt', {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now')
    });
      return Promise.resolve();
    } catch(e){
      return Promise.reject(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try{
      await queryInterface.changeColumn('Chatrooms', 'type', {
      type: Sequelize.ENUM('Private', 'Group'),
      allowNull: false
    });
      await queryInterface.changeColumn('Chatrooms', 'createdAt', {
      allowNull: false,
      type: Sequelize.DATE,
    });
      await queryInterface.changeColumn('Chatrooms', 'updatedAt', {
      allowNull: false,
      type: Sequelize.DATE,
    });
      return Promise.resolve();
    } catch(e){
      return Promise.reject(e);
    }
  }
};
