const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/index.js');
const Professional = require('./professional.js');
const Patient = require('./patient.js');

const Session = sequelize.define('session', {
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME(6),
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME(6),
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
});

module.exports = Session;