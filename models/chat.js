'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    sender: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    isRead: DataTypes.BOOLEAN,
    imagePath: DataTypes.STRING,
    reciever: DataTypes.INTEGER,
    type: {
      type: DataTypes.ENUM,
      values: ['Private', 'Group']
    },
  }, {});
  Chat.associate = function (models) {
    // associations can be defined here
  };
  return Chat;
};