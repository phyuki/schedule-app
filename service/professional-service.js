const sequelize = require('../db');
const { Op } = require('sequelize');
const Professional = require('../models/professional.js');

async function createProfessional( professional ) {
    try {
        const result = await Professional.create(professional)
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
            },
            order: ['name'],
            limit: 6
        })
        return professionals.map((prof) => prof.dataValues)
    } catch (err) {
        console.log("SQL Error: "+err)
        return false
    }
}

async function updateProfessional( professionalId, professional ) {
    try {
        const result = await Professional.update(
            professional,
            { where: {id: professionalId} }
        )
        return !!result
    } catch (err) {
        console.log("SQL Error: "+err)
        return false
    }
}

module.exports = { 
    createProfessional, 
    fetchAllProfessionals, 
    searchProfessionals, 
    updateProfessional 
}