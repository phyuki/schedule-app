const sequelize = require('../db');
const Clinic = require('../models/clinic.js');

async function searchClinic() {
    try{
        const clinic = await Clinic.findOne()
        if (clinic) return clinic.dataValues
        else return false
    } catch (err) {
        console.log("SQL Error: "+err)
        return false
    }
}

async function createClinic( clinic ) {
    try {
        const created = await Clinic.create(clinic)
        return created
    } catch (err) {
        console.log("SQL Error: " + err)
        return false
    }
}

module.exports = { searchClinic, createClinic }