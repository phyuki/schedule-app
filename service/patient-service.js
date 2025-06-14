const sequelize = require('../db');
const { Op } = require('sequelize');
const Patient = require('../models/patient.js');

async function searchPatients( search ) {

    try{
        const patients = await Patient.findAll({
            where: {
                name: { [Op.like]:  `%${search}%`}
            }
        })
        return patients.map((patient) => patient.dataValues)
    } catch (err) {
        console.log("SQL Error: "+err)
        return false
    }
}

async function createPatient( patient ) {
    try {
        const result = await Patient.create(patient)
        if(result && result.dataValues) {
            return result.dataValues.id
        } else {
            return false
        }
    } catch (err) {
        console.log("SQL Error: " + err)
        return false
    }
}


async function updatePatient( patientId, patient ) {
    try {
        const result = await Patient.update(
            patient,
            { where: {id: patientId} }
        )
        return !!result
    } catch (err) {
        console.log("SQL Error: "+err)
        return false
    }
}



module.exports = { 
    searchPatients,
    createPatient,
    updatePatient
}