module.exports = ({ Patient, Professional, Session }) => {
    Session.belongsTo(Patient, { foreignKey: 'patientId' })
    Session.belongsTo(Professional, { foreignKey: 'professionalId' })

    Professional.hasMany(Session, { foreignKey: 'professionalId' })
    Patient.hasMany(Session, { foreignKey: 'patientId' })
} 
