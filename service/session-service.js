const sequelize = require('../db');
const { Op } = require('sequelize');
const Session = require('../models/session.js');

async function findSessionsByProfessional( professionalId, activeWeek ) {

    const {start, end} = activeWeek
    
    if(start === null || end === null){
        console.error("Start or End can't be null")
        return false
    }

    try{
        const sessions = await Session.findAll({
            where: {
                professionalId: professionalId,
                date: {
                    [Op.between]: [start, end]
                }
            },
        })
        return sessions.map((session) => session.dataValues)
    } catch (err) {
        console.log("SQL Error: "+err)
        return false
    }
}

async function createSession( session ) {

    try {
        const result = await Session.create(session)
        return !!result
    } catch (err) {
        console.log("SQL Error: "+err)
        return false
    }

}

module.exports = { findSessionsByProfessional, createSession }