import { Autocomplete, Snackbar, TextField } from "@mui/material"
import { useEffect, useState } from "react"

export default function RegistrationForm ({ 
    searchLabel, noOptionsText, fetchOptions, 
    createItem, updateItem, handleSubmit, 
    changeFormItems, children 
}) {
    
    const [options, setOptions] = useState([])
    const [searchInput, setSearchInput] = useState('')
    const [selected, setSelected] = useState(null)
    
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [isRegister, setIsRegister] = useState(true)
    
    async function updateOptions() {
        const result = await fetchOptions(searchInput)
        setOptions(result)
        if(result.length === 0) setLoading(false)
    }

    useEffect(() => {
        if(!searchInput) {
            setOptions([])
            return
        } else {
            setLoading(true)
        } 

        updateOptions()
    }, [searchInput])                                            

    function switchToRegister() {
        setSearchInput('')
        setSelected(null)
        setOptions([])
        setIsRegister(true)
        changeFormItems()
    }

    function handleChange(event, selectedOption) {
        setSelected(selectedOption)
        setLoading(false)
        if(selectedOption) {
            changeFormItems(selectedOption)
            setIsRegister(false)
        } else {
            changeFormItems()
            setIsRegister(true)
        }
    }

    async function onSubmit( data ) {
        
        let result = false, successMessage

        if(isRegister) {
            result = await createItem(data)
            successMessage = `${searchLabel} cadastrado com sucesso!`
        } else {
            const id = selected.id
            result = await updateItem(id, data)
            successMessage = "Dados atualizados com sucesso!"
        }

        if(result) {
            setSnackbarMessage(successMessage)
            setOptions([result])
            setSelected(result)
            
            if(isRegister) setIsRegister(false)
        } else {
            setSnackbarMessage("Não foi possível efetuar esta operação - Tente Novamente!")
        }

        setSnackbarOpen(true)
    }

    function onError( errors ) {
        setSnackbarMessage("Preencha os campos apropriadamente!")
        setSnackbarOpen(true) 
    }

    return (
        <div>
            <Snackbar 
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
            <div className="row-flex center">
                <Autocomplete 
                    disablePortal
                    value={selected}
                    options={options}
                    getOptionLabel={(option) => option ? option.name : option}
                    onInputChange={(event, input) => setSearchInput(input)}
                    onChange={handleChange}
                    loading={loading}
                    sx={{width: 300}}
                    noOptionsText={noOptionsText}
                    renderInput={(params) => <TextField {...params} label={searchLabel} />}
                />
                <button className="button" onClick={switchToRegister}>+</button>
            </div>
            <form className="column-flex center" onSubmit={handleSubmit(onSubmit, onError)}>
                {children}
                <input type="submit" className="button" 
                       value={isRegister ? "Cadastrar" : "Atualizar"} />
            </form>
        </div>
    )

}