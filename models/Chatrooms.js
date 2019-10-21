/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Chatrooms', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    participants: {
      type: DataTypes.JSON,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    creator: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    type: {
      type: DataTypes.ENUM('Private','Group'),
      allowNull: false,
      defaultValue: 'Private'
    }
  }, {
    tableName: 'Chatrooms'
  });
};
