const sequelize = require('../db'); 

const Clinic = require('./clinic');
const Patient = require('./patient');
const Professional = require('./professional');
const Progress = require('./progress');
const Session = require('./session');

require('./associations')({ Patient, Professional, Session, Progress })

module.exports = {
    sequelize,
    Clinic,
    Patient,
    Professional,
    Session,
    Progress
}