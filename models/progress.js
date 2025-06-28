const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/index.js');
const Professional = require('./professional.js');
const Patient = require('./patient.js');

const Progress = sequelize.define('progress', {
  subject: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  patientId: {
    type: Sequelize.INTEGER,
    references: {
        model: Patient,
        key: 'id'
    },
    allowNull: false
  },
  professionalId: {
    type: Sequelize.INTEGER,
    references: {
        model: Professional,
        key: 'id'
    },
    allowNull: false
  }
}, {
  freezeTableName: true
});

module.exports = Progress;