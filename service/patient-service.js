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

module.exports = { searchPatients }