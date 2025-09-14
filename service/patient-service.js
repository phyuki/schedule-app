const sequelize = require('../db');
const { Op, fn, col } = require('sequelize');
const Patient = require('../models/patient.js');

async function searchPatients( search, sorting, pagination = false ) {
    const where = search
      ? { name: { [Op.like]: `%${search}%` } }
      : {};
    try{
        const patients = await Patient.findAndCountAll({
            where,
            order: [ [col(sorting.sortBy), sorting.sortDir] ],
            limit: pagination ? sorting.size : null,
            offset: pagination ? (sorting.page - 1) * sorting.size : null
        })
        return {
            patients: patients.rows.map((p) => p.dataValues),
            total: patients.count
        }
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

async function deleteById( id ) {
    try {
        const result = await Patient.destroy({
            where: {
                id
            },
        });
        return result;
    } catch (err) {
        console.log("SQL Error: "+err)
        return false
    }
}

module.exports = { 
    searchPatients,
    createPatient,
    updatePatient,
    deleteById
}