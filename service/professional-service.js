const sequelize = require('../db');
const { Op } = require('sequelize');
const Professional = require('../models/professional.js');

async function saveProfessional( professional ) {
    try {
        const result = await Professional.create(professional)
        return result !== null && result !== undefined
    } catch (err) {
        console.log("SQL Error: " + err)
        return false
    }
}

async function fetchAllProfessionals() {
    try {
        const professionals = await Professional.findAll()
        return professionals.map((prof) => prof.dataValues)
    } catch (err) {
        console.log("SQL Error: " + err)
        return null
    }
}

async function searchProfessionals( search ) {
    try{
        const professionals = await Professional.findAll({
            where: {
                name: { [Op.like]:  `%${search}%`}
            }
        })
        return professionals.map((prof) => prof.dataValues)
    } catch (err) {
        console.log("SQL Error: "+err)
        return false
    }
}

module.exports = { saveProfessional, fetchAllProfessionals, searchProfessionals }