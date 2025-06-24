const sequelize = require('../db');
const { Op } = require('sequelize');
const { Session, Patient, Professional } = require('../models');

async function findSessionsByProfessional( professionalId, activeWeek ) {

    const {start, end} = activeWeek
    
    if(start === null || end === null){
        console.error("Start or End can't be null")
        return false
    }

    try{
        const sessions = await Session.findAll({
            attributes: {
                exclude: ['patientId', 'professionalId']
            },
            where: {
                professionalId: professionalId,
                date: {
                    [Op.between]: [start, end]
                }
            },
            include: [
                { model: Patient }, 
                { model: Professional }
            ]
        })
        return sessions.map((session) => {
            session.dataValues.patient = session.dataValues.patient.dataValues
            session.dataValues.professional = session.dataValues.professional.dataValues
            return session.dataValues
        })
    } catch (err) {
        console.log("SQL Error: "+err)
        return false
    }
}

async function findSessionsByDate( professionalId, date) {

    try {
        const sessions = await Session.findAll({
            attributes: ['id', 'startTime', 'endTime'],
            where: {
                professionalId: professionalId,
                date: date
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

async function updateSession( sessionId, session ) {
    try {
        const result = await Session.update(
            session,
            { where: { id: sessionId } }
        )
        return !!result
    } catch (err) {
        console.log("SQL Error: "+err)
        return false
    }
}

module.exports = { 
    findSessionsByProfessional, 
    findSessionsByDate, 
    createSession,
    updateSession
}