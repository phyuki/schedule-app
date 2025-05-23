const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'schedules.sqlite',
  logging: console.log
});

module.exports = sequelize;
