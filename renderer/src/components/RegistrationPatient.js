import { useState } from "react";
import { TextField } from "@mui/material";

import RegistrationForm from "./RegistrationForm";
import PhoneInput from "./PhoneInput";

export default function RegistrationPatient() {

    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')

    const [nameError, setNameError] = useState('')
    const [addressError, setAddressError] = useState('')
    const [phoneError, setPhoneError] = useState('')

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

    const validateIsEmpty = (field, setFieldError) => {
        if(field.trim() === '') {
            setFieldError('Campo obrigatório')
            return false
        } else {
            setFieldError('')
            return true
        }
    }

    const validateFields = () => {
        const validateName = validateIsEmpty(name, setNameError)
        const validateAddress = validateIsEmpty(address, setAddressError)
        const validatePhone = validateIsEmpty(phone, setPhoneError)

        return validateName && validateAddress && validatePhone
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
            validateFields={validateFields}
        >
            <TextField 
                label="Nome completo"
                value={name}
                onChange={(event) => setName(event.target.value)}
                error={!!nameError}
                helperText={nameError}
            />
            <TextField 
                label="Endereço"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                error={!!addressError}
                helperText={addressError}
            />
            <PhoneInput 
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                helperText={phoneError}
            />
        </RegistrationForm>
    )
}