const sequelize = require('../db');
const Professional = require('../db/professional.js');

async function existsAnyProfessional() {
    try{
        const exists = await Professional.findOne()
        return !!exists
    } catch (err) {
        console.log("SQL Error: "+err)
        return false
    }
}

async function saveProfessionals( professionals ) {
    try{
        const result = await Professional.bulkCreate(professionals)
        return result !== null && result !== undefined && result.length > 0
    } catch (err) {
        console.log("SQL Error: " + err)
        return false
    }
}

module.exports = { existsAnyProfessional, saveProfessionals }