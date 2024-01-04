const { DataTypes } = require('sequelize');
const DB = require('../config/Database');

const Instagram = DB.define('Instagram', {
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: DataTypes.STRING,
  password: DataTypes.STRING,
});

module.exports = Instagram;