const { DataTypes } = require('sequelize');
const sequelize = require('../db/index.js');

const Professional = sequelize.define('professional', {
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

module.exports = Professional;