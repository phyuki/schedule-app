const sequelize = require('../db'); 

const Clinic = require('./clinic');
const Patient = require('./patient');
const Professional = require('./professional');
const Session = require('./session');

require('./associations')({ Patient, Professional, Session })

module.exports = {
    sequelize,
    Clinic,
    Patient,
    Professional,
    Session
}