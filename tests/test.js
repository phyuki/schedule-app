const sequelize = require('../db')
require('../models/associations')

const Clinic = require('../models/clinic')
const Patient = require('../models/patient')
const Professional = require('../models/professional')
const Session = require('../models/session')

const { searchClinic } = require('../service/clinic-service')
const { saveProfessional } = require('../service/professional-service')
const { findSessionsByProfessional } = require('../service/session-service')

async function testSearchClinic() {

    try {
        await sequelize.authenticate()
        console.log('Conexão estabelecida')
        
        await sequelize.drop()
        await sequelize.sync()

        await Clinic.findOrCreate({
            where: { name: 'FisioPilates' }
        }).then(console.log('Clínica criada'))

        const clinic = await searchClinic()
        if (clinic) 
            console.log('Clínica encontrada: ' + clinic.name)
        else
            console.error('Erro em busca')
    } catch (err) {
        console.error(('Erro de execução: ' + err))
    } finally {
        await sequelize.close()
    }

}

async function testFindSessionsByProfessional() {

    try {
        await sequelize.authenticate()
        console.log('Conexão estabelecida')
        
        await sequelize.drop()
        await sequelize.sync()

        await Professional.bulkCreate([{
            name: 'Julio',
            address: 'Rua ABC, 123',
            phone: '73999833942'
        }, {
            name: 'Ana Beatriz',
            address: 'Rua XYZ, 123',
            phone: '27999833945'
        }])

        await Patient.findOrCreate({
            where: { name: 'Pedro' },
            defaults: {
                address: 'Rua ABC, 123',
                phone: '73999833842'
            }
        })

        await Session.bulkCreate([{
            subject: 'Pilates',
            date: '2025-06-01',
            startTime: '08:50:00',
            endTime: '10:00:00',
            patientId: 1,
            professionalId: 1
        }, {
            subject: 'Ultrassonografia',
            date: '2025-06-06',
            startTime: '08:50:00',
            endTime: '10:00:00',
            patientId: 1,
            professionalId: 1
        }]).then(console.log('Sessões criadas'))

        const professionalId = 1
        const today = new Date()
        const dayWeek = today.getDay()

        const startWeek = new Date()
        startWeek.setDate(today.getDate() - dayWeek)

        const endWeek = new Date()
        endWeek.setDate(startWeek.getDate() + 6)
        const activeWeek = {start: startWeek, end: endWeek}

        const sessions = await findSessionsByProfessional(professionalId, activeWeek)
        const formattedEvents = sessions.map((session) => {
            const title = session.subject
            const start = session.date + "T" + session.startTime
            const end = session.date + "T" + session.endTime
            return {title, start, end}
        })
        console.log(formattedEvents)
    } catch (err) {
        console.error(('Erro de execução: ' + err))
    } finally {
        await sequelize.close()
    }

}

testFindSessionsByProfessional()