module.exports = ({ Patient, Professional, Session, Progress }) => {
    Session.belongsTo(Patient, { foreignKey: 'patientId' })
    Session.belongsTo(Professional, { foreignKey: 'professionalId' })

    Progress.belongsTo(Patient, { foreignKey: 'patientId' })
    Progress.belongsTo(Professional, { foreignKey: 'professionalId' })

    Professional.hasMany(Session, { foreignKey: 'professionalId' })
    Professional.hasMany(Progress, { foreignKey: 'professionalId' })
    Patient.hasMany(Session, { foreignKey: 'patientId' })
    Patient.hasMany(Progress, { foreignKey: 'patientId' })
} 
