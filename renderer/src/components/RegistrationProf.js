import { useState } from "react";
import RegistrationForm from "./RegistrationForm";
import { TextField } from "@mui/material";

export default function RegistrationProf() {
    
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')

    const [nameError, setNameError] = useState('')
    const [addressError, setAddressError] = useState('')
    const [phoneError, setPhoneError] = useState('')

    async function fetchProfessionals(search) {
        return window.professionalAPI.searchProfessionals(search)
    }

    async function createProfessional() {
        const professional = {name, address, phone}
        const result = await window.professionalAPI.createProfessional(professional)
        
        if(result)
            return {...professional, id: result}

        return result
    }

    async function updateProfessional(professionalId) {
        const professional = {name, address, phone}
        const result = await window.professionalAPI.updateProfessional(professionalId, professional)
    
        if(result)
            return {...professional, id: professionalId}

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

    function changeFormItems(professional) {
        let newName = '', newAddress = '', newPhone = ''
        
        if(professional) {
            newName = professional.name
            newAddress = professional.address
            newPhone = professional.phone
        }

        setName(newName)
        setAddress(newAddress)
        setPhone(newPhone)
    }

    return (
        <RegistrationForm 
            searchLabel={"Profissional"}
            noOptionsText={"Nenhum profissional encontrado"}
            fetchOptions={fetchProfessionals}
            createItem={createProfessional}
            updateItem={updateProfessional}
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
            <TextField 
                label="Telefone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                error={!!phoneError}
                helperText={phoneError}
            />
        </RegistrationForm>
    )
}
