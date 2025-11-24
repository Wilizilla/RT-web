// src/config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('db_estoque2', 'luckless4636', '80UtR2XQ^M0%$cH', {
  host: '177.153.69.18',
  port: '3306',
  dialect: 'mysql',
  logging: false 
});

module.exports = sequelize;