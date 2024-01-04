const { DataTypes } = require('sequelize');
const DB = require('../config/Database');

const Telegram = DB.define('Telegram', {
    stringSession:DataTypes.TEXT,
});

module.exports = Telegram;