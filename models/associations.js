const Patient = require("./patient");
const Professional = require("./professional");
const Session = require("./session");

Session.belongsTo(Patient, { foreignKey: 'patientId' })
Session.belongsTo(Professional, { foreignKey: 'professionalId' })
Professional.hasMany(Session, { foreignKey: 'professionalId' })
Patient.hasMany(Session, { foreignKey: 'patientId' })

module.exports = { Session, Patient, Professional }
