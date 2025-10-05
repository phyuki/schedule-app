const { contextBridge, ipcRenderer } = require('electron');
const { searchClinic, createClinic } = require('./service/clinic-service');
const { createProfessional, fetchAllProfessionals, searchProfessionals, updateProfessional, deleteProfessionalById } = require('./service/professional-service');
const { findSessionsByProfessional, createSession, findSessionsByDate, updateSession, deleteSessionById } = require('./service/session-service');
const { searchPatients, createPatient, updatePatient, deleteById } = require('./service/patient-service');
const { findProgressByPatient, createProgress, updateProgress, fetchAllProgress } = require('./service/progress-service');
const { downloadReport } = require('./service/report-service');

function withDelay(fn, delay = 500) {
  return async (...args) => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    return fn(...args);
  };
}

contextBridge.exposeInMainWorld('clinicAPI', {
  createClinic: async (clinic) => await createClinic(clinic),
  searchClinic: async () => await searchClinic()
})

contextBridge.exposeInMainWorld('professionalAPI', {
  createProfessional: withDelay(createProfessional),
  fetchAllProfessionals: withDelay(fetchAllProfessionals),
  searchProfessionals: withDelay(searchProfessionals),
  updateProfessional: withDelay(updateProfessional),
  deleteById: withDelay(deleteProfessionalById)
})

contextBridge.exposeInMainWorld('sessionAPI', {
  findSessionsByProfessional: withDelay(findSessionsByProfessional),
  findSessionsByDate: withDelay(findSessionsByDate),
  createSession: withDelay(createSession),
  updateSession: withDelay(updateSession),
  deleteById: withDelay(deleteSessionById),
})

contextBridge.exposeInMainWorld('patientAPI', {
  searchPatients: withDelay(searchPatients),
  createPatient: withDelay(createPatient),
  updatePatient: withDelay(updatePatient),
  deleteById: withDelay(deleteById)
})

contextBridge.exposeInMainWorld('progressAPI', {
  fetchAllProgress: withDelay(fetchAllProgress),
  findProgressByPatient: withDelay(findProgressByPatient),
  createProgress: withDelay(createProgress),
  updateProgress: withDelay(updateProgress)
})

contextBridge.exposeInMainWorld('reportAPI', {
  downloadReport: withDelay(downloadReport),
})

contextBridge.exposeInMainWorld("electronAPI", {
  selectFolder: () => ipcRenderer.invoke("select-folder"),
});

console.log('Preload carregado!')