import { useEffect, useState } from "react";
import RegistrationForm from "./RegistrationForm";
import { TextField } from "@mui/material";

export default function RegistrationPatient() {

    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')

    async function fetchPatients(search) {
        return window.patientAPI.searchPatients(search)
    }

    async function createPatient() {
        const patient = {name, address, phone}
        const result = await window.patientAPI.createPatient(patient)

        if(result)
            return {...patient, id: result}

        return result
    }

    async function updatePatient(patientId) {
        const patient = {name, address, phone}
        const result = await window.patientAPI.updatePatient(patientId, patient)
        
        if(result)
            return {...patient, id: patientId}

        return result
    }

    function changeFormItems(patient) {
        let newName = '', newAddress = '', newPhone = ''
        
        if(patient) {
            newName = patient.name
            newAddress = patient.address
            newPhone = patient.phone
        }

        setName(newName)
        setAddress(newAddress)
        setPhone(newPhone)
    }

    return (
        <RegistrationForm 
            searchLabel={"Paciente"}
            noOptionsText={"Nenhum paciente encontrado"}
            fetchOptions={fetchPatients}
            createItem={createPatient}
            updateItem={updatePatient}
            changeFormItems={changeFormItems}
        >
            <TextField 
                label="Nome completo"
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
            <TextField 
                label="Endereço"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
            />
            <TextField 
                label="Telefone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
            />
        </RegistrationForm>
    )
}