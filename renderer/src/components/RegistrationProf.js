import { useEffect, useState } from "react";
import RegistrationForm from "./RegistrationForm";
import { TextField } from "@mui/material";

export default function RegistrationProf() {

    const [professionals, setProfessionals] = useState([{name: "label"}])
    const [searchInput, setSearchInput] = useState('')
    const [selected, setSelected] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isRegister, setIsRegister] = useState(true)

    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')

    async function fetchProfessionals() {
        const result = await window.professionalAPI.searchProfessionals(searchInput)
        setProfessionals(result)
        if(result.length === 0) setLoading(false)
    }

    useEffect(() => {
        if(!searchInput || searchInput.length < 3) {
            setProfessionals([])
            return
        }

        setLoading(true)
        fetchProfessionals()
    }, [searchInput])

    function changeFormItems(name, address, phone) {
        setName(name)
        setAddress(address)
        setPhone(phone)
    }

    function switchToRegister() {
        setSearchInput('')
        setSelected(null)
        setProfessionals([])
        setIsRegister(true)
        changeFormItems('', '', '')
    }

    function handleChange(event, selectedOption) {
        setSelected(selectedOption)
        if(selectedOption) {
            const {name, address, phone} = selectedOption
            changeFormItems(name, address, phone)
            setIsRegister(false)
        } else {
            changeFormItems('', '', '')
            setIsRegister(true)
        }
    }

    async function registerProfessional( event ) {
        event.preventDefault()
        
        const professional = {name, address, phone}
        let result = false, successMessage

        if(isRegister) {
            result = await window.professionalAPI.createProfessional(professional)
            successMessage = "Profissional cadastrado com sucesso!"
            setIsRegister(false)
        } else {
            const professionalId = selected.id
            result = await window.professionalAPI.updateProfessional(professionalId, professional)
            successMessage = "Dados atualizados com sucesso!"
        }

        if(result) {
            alert(successMessage)
            if(isRegister) {
                const newProfessional = {...professional, id: result}
                setProfessionals([newProfessional])
                setSelected(newProfessional)
            }
        } else {
            alert("Não foi possível efetuar esta operação - Tente Novamente!")
        }
    }

    return (
        <RegistrationForm 
            value={selected}
            options={professionals}
            setOptions={setProfessionals}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleChange={handleChange}
            loading={loading}
            noOptionsText={"Nenhum profissional selecionado"}
            searchLabel={"Profissional"}
            switchToRegister={switchToRegister}
            handleSubmit={registerProfessional} 
            isRegister={isRegister}
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