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
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  paranoid: true, 
  timestamps: true, 
  deletedAt: "deletedAt",
});

module.exports = Professional;