const { contextBridge } = require('electron');
const { searchClinic, createClinic } = require('./service/clinic-service');
const { createProfessional, fetchAllProfessionals, searchProfessionals, updateProfessional } = require('./service/professional-service');
const { findSessionsByProfessional, createSession, findSessionsByDate, updateSession } = require('./service/session-service');
const { searchPatients, createPatient, updatePatient, deleteById } = require('./service/patient-service');
const { findProgressByPatient, createProgress, updateProgress, fetchAllProgress } = require('./service/progress-service');
const { createReport } = require('./service/report-service');

contextBridge.exposeInMainWorld('clinicAPI', {
  createClinic: async (clinic) => await createClinic(clinic),
  searchClinic: async () => await searchClinic()
})

contextBridge.exposeInMainWorld('professionalAPI', {
  createProfessional: async (professional) => await createProfessional(professional),
  fetchAllProfessionals: async () => await fetchAllProfessionals(),
  searchProfessionals: async (search, sorting, pagination) => await searchProfessionals(search, sorting, pagination),
  updateProfessional: async (professionalId, professional) => await updateProfessional(professionalId, professional),
  deleteById: async (id) => await deleteById(id)
})

contextBridge.exposeInMainWorld('sessionAPI', {
  findSessionsByProfessional: async (professionalId, activeWeek) => await findSessionsByProfessional(professionalId, activeWeek),
  findSessionsByDate: async (professionalId, date) => await findSessionsByDate(professionalId, date),
  createSession: async (session) => await createSession(session),
  updateSession: async (sessionId, session) => await updateSession(sessionId, session)
})

contextBridge.exposeInMainWorld('patientAPI', {
  searchPatients: async (search, sorting, pagination) => await searchPatients(search, sorting, pagination),
  createPatient: async (patient) => await createPatient(patient),
  updatePatient: async (patientId, patient) => await updatePatient(patientId, patient),
  deleteById: async (patientId) => await deleteById(patientId)
})

contextBridge.exposeInMainWorld('progressAPI', {
  fetchAllProgress: async (patientId) => await fetchAllProgress(patientId),
  findProgressByPatient: async (patientId, page, size) => await findProgressByPatient(patientId, page, size),
  createProgress: async (progress) => await createProgress(progress),
  updateProgress: async (progressId, progress) => await updateProgress(progressId, progress)
})

contextBridge.exposeInMainWorld('reportAPI', {
  createReport: (patient, data) => createReport(patient, data),
})

console.log('Preload carregado!')