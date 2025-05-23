const { DataTypes } = require('sequelize');
const sequelize = require('../db/index.js');

const Clinic = sequelize.define('clinic', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  img: {
    type: DataTypes.STRING
  }
});

module.exports = Clinic;