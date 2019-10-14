'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chatroom = sequelize.define('Chatroom', {
    participants: DataTypes.INTEGER,
    name: DataTypes.STRING,
    creator: DataTypes.INTEGER
  }, {});
  Chatroom.associate = function(models) {
    Chatroom.hasMany(models.Chat, {as: 'chats'})
  };
  return Chatroom;
};