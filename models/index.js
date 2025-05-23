const sequelize = require('../db'); 
const Clinic = require('./clinic');
const Patient = require('./patient');
const Professional = require('./professional');
const Session = require('./session');

module.exports = { sequelize, Clinic, Professional, Patient, Session };