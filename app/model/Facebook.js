const { DataTypes } = require('sequelize');
const DB = require('../config/Database');

const Facebook = DB.define('account', {
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  cookie:DataTypes.TEXT
});

module.exports = Facebook;