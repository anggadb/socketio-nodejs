'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chatroom = sequelize.define('Chatroom', {
    participants: DataTypes.INTEGER,
    name: DataTypes.STRING,
    creator: DataTypes.INTEGER
  }, {});
  Chatroom.associate = function(models) {
    // associations can be defined here
  };
  return Chatroom;
};