const { DataTypes } = require('sequelize');
const DB = require('../config/Database');

const Email = DB.define('Email', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
});

module.exports = Email;