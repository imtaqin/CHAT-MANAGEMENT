const { DataTypes } = require('sequelize');
const DB = require('../config/Database');

const Webhook = DB.define('Webhook', {
  url:DataTypes.STRING
});

module.exports = Webhook;