const sequelize = require('../db')
require('../db/associations')

const Clinic = require('../db/clinic')
const Patient = require('../db/patient')
const Professional = require('../db/professional')
const Session = require('../db/session')

const { searchClinic } = require('../service/clinic-service')
const { existsAnyProfessional, saveProfessionals } = require('../service/professional-service')
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

async function testSaveProfessionals() {

    try {
        await sequelize.authenticate()
        console.log('Conexão estabelecida')
        
        await sequelize.drop()
        await sequelize.sync()

        const professionals = [{
            name: 'Julio',
            address: 'Rua ABC, 123',
            phone: '73999833942'
        }, {
            name: 'Ana Beatriz',
            address: 'Rua XYZ, 123',
            phone: '27999833945'
        }]

        const created = await saveProfessionals(professionals)
        if(created) console.log('Profissionais cadastrados com sucesso')
        else console.log('Erro de execução')
        
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
            date: '2025-05-19',
            startTime: '08:50:00',
            endTime: '10:00:00',
            patientId: 1,
            professionalId: 1
        }, {
            subject: 'Ultrassonografia',
            date: '2025-05-26',
            startTime: '08:50:00',
            endTime: '10:00:00',
            patientId: 1,
            professionalId: 1
        }]).then(console.log('Sessões criadas'))

        const professionalId = 1
        const sessions = await findSessionsByProfessional(professionalId)
        console.log(sessions)
    } catch (err) {
        console.error(('Erro de execução: ' + err))
    } finally {
        await sequelize.close()
    }

}

testFindSessionsByProfessional()