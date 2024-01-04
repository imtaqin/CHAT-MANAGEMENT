const { DataTypes } = require('sequelize');
const DB = require('../config/Database');

const Tiktok = DB.define('Tiktok', {
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  cookie:DataTypes.TEXT
});

module.exports = Tiktok;