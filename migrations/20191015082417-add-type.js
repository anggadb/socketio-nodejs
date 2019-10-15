'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Chatrooms', 'type', {
      type: Sequelize.ENUM('Private', 'Group'),
      allowNull: false
    })
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.removeColumn('Chatrooms', 'type')
  }
};
