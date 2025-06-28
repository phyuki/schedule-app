const sequelize = require('../db');
const { Op } = require('sequelize');
const { Progress, Professional } = require('../models');

async function findProgressByPatient( patientId, page, size ) {

    const offset = (page - 1) * size

    try{
        const result = await Progress.findAndCountAll({
            attributes: {
                exclude: ['patientId', 'professionalId']
            },
            where: {
                patientId: patientId
            },
            include: [
                { model: Professional }
            ],
            order: [ ['createdAt', 'DESC'] ],
            limit: size,
            offset
        })
        
        result.rows = result.rows.map((progress, index) => {
            progress.dataValues.professional = progress.dataValues.professional.dataValues
            const title = result.count - offset - index
            return {...progress.dataValues , title}
        })

        const totalPages = Math.ceil(result.count / size)
        return {...result, totalPages}
    } catch (err) {
        console.log("SQL Error: "+err)
        return false
    }
}

async function createProgress( progress ) {
    try {
        const result = await Progress.create(progress)
        return !!result
    } catch (err) {
        console.log("SQL Error: "+err)
        return false
    }
}

async function updateProgress( progressId, progress ) {
    try {
        const result = await Progress.update(
            progress,
            { where: { id: progressId } }
        )
        return !!result
    } catch (err) {
        console.log("SQL Error: "+err)
        return false
    }
}

module.exports = { 
    findProgressByPatient,
    createProgress,
    updateProgress
}
