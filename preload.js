const { contextBridge } = require('electron');
const { searchClinic, createClinic } = require('./service/clinic-service');
const { createProfessional, fetchAllProfessionals, searchProfessionals, updateProfessional } = require('./service/professional-service');
const { findSessionsByProfessional, createSession, findSessionsByDate } = require('./service/session-service');
const { searchPatients, createPatient, updatePatient } = require('./service/patient-service');

contextBridge.exposeInMainWorld('clinicAPI', {
    createClinic: async (clinic) => await createClinic(clinic),
    searchClinic: async () => await searchClinic()
})

contextBridge.exposeInMainWorld('professionalAPI', {
    createProfessional: async (professional) => await createProfessional(professional),
    fetchAllProfessionals: async () => await fetchAllProfessionals(),
    searchProfessionals: async (search) => await searchProfessionals(search),
    updateProfessional: async (professionalId, professional) => await updateProfessional(professionalId, professional)
})

contextBridge.exposeInMainWorld('sessionAPI', {
    findSessionsByProfessional: async (professionalId, activeWeek) => await findSessionsByProfessional(professionalId, activeWeek),
    findSessionsByDate: async (professionalId, date) => await findSessionsByDate(professionalId, date),
    createSession: async (session) => await createSession(session)
})

contextBridge.exposeInMainWorld('patientAPI', {
    searchPatients: async (search) => await searchPatients(search),
    createPatient: async (patient) => await createPatient(patient),
    updatePatient: async (patientId, patient) => await updatePatient(patientId, patient)
})

console.log('Preload carregado!')