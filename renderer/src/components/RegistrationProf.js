import { useState } from "react";
import RegistrationForm from "./RegistrationForm";

export default function RegistrationProf() {

    const [professionals, setProfessionals] = useState([{name: "label"}])
    const [searchInput, setSearchInput] = useState('')
    const [selected, setSelected] = useState(null)

    function clearForm() {
        setSearchInput('')
        setSelected(null)
        setProfessionals([])
    }

    function registerProfessional( event ) {
        event.preventDefault()
        
        
    }

    return (
        <RegistrationForm 
            value={selected}
            options={professionals}
            setOptions={setProfessionals}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            setSelectedOption={setSelected}
            noOptionsText={"Nenhum profissional selecionado"}
            searchLabel={"Profissional"}
            clearForm={clearForm}
            handleSubmit={registerProfessional} />
    )

}