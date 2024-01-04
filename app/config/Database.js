const sequelize = require('sequelize');

const DB = new sequelize({
    dialect: 'sqlite',
    storage: './database/database.sqlite',
    logging: false
});

module.exports = DB;