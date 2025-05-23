const { DataTypes } = require('sequelize');
const sequelize = require('../db/index.js');

const Patient = sequelize.define('patient', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(11),
    allowNull: false,
  },
});

module.exports = Patient;