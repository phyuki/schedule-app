const sequelize = require('../db');
const { Op } = require('sequelize');
const Session = require('../db/session.js');

async function findSessionsByProfessional( professionalId ) {

    const today = new Date()
    const nextWeek = new Date() 
    nextWeek.setDate(today.getDate() + 7)

    try{
        const sessions = await Session.findAll({
            where: {
                professionalId: professionalId,
                date: {
                    [Op.between]: [today, nextWeek]
                }
            },
        })
        return sessions.map((session) => session.dataValues)
    } catch (err) {
        console.log("SQL Error: "+err)
        return false
    }
}

module.exports = { findSessionsByProfessional }