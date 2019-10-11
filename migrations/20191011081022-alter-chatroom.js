'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Chatrooms', 'chats')
  },

  down: (queryInterface, Sequelize) => {
    // return queryInterface.addColumn('Chatrooms', 'chatIds', Sequelize.ARRAY(Sequelize.INTEGER))
  }
};
