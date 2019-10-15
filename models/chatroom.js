'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chatroom = sequelize.define('Chatroom', {
    participants: DataTypes.JSON,
    name: DataTypes.STRING,
    creator: DataTypes.INTEGER
  }, {});
  Chatroom.associate = function(models) {
  };
  return Chatroom;
};