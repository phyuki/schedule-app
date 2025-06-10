const { contextBridge } = require('electron');
const { searchClinic, createClinic } = require('./service/clinic-service');
const { saveProfessional, fetchAllProfessionals, searchProfessionals } = require('./service/professional-service');
const { findSessionsByProfessional, registerSession } = require('./service/session-service');
const { searchPatients } = require('./service/patient-service');

contextBridge.exposeInMainWorld('clinicAPI', {
    createClinic: async (clinic) => await createClinic(clinic),
    searchClinic: async () => await searchClinic()
})

contextBridge.exposeInMainWorld('professionalAPI', {
    saveProfessional: async (clinic) => await saveProfessional(clinic),
    fetchAllProfessionals: async () => await fetchAllProfessionals(),
    searchProfessionals: async (search) => await searchProfessionals(search)
})

contextBridge.exposeInMainWorld('sessionAPI', {
    findSessionsByProfessional: async (professionalId, activeWeek) => await findSessionsByProfessional(professionalId, activeWeek),
    registerSession: async (session) => await registerSession(session)
})

contextBridge.exposeInMainWorld('patientAPI', {
    searchPatients: async (search) => await searchPatients(search)
})

console.log('Preload carregado!')