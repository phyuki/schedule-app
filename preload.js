const { contextBridge } = require('electron');
const {searchClinic, createClinic} = require('./service/clinic-service')

contextBridge.exposeInMainWorld('clinicAPI', {
    createClinic: async (clinic) => await createClinic(clinic),
    searchClinic: async () => await searchClinic()
})

console.log('Preload carregado!')