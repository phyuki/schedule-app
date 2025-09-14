import { Alert, Autocomplete, Card, CardContent, Grid, Snackbar, TextField } from "@mui/material"
import { UserCirclePlus, CheckCircle, WarningCircle, Info, XCircle } from "phosphor-react"
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
    const [severityMessage, setSeverityMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [isRegister, setIsRegister] = useState(true)
    
    async function updateOptions() {
        const result = await fetchOptions(searchInput)
        setOptions(result)
        setLoading(false)
    }

    useEffect(() => {
        if(!searchInput) {
            setOptions([])
            setLoading(false)
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
            setSeverityMessage("success")
            setOptions([result])
            setSelected(result)
            
            if(isRegister) setIsRegister(false)
        } else {
            setSeverityMessage("error")
            setSnackbarMessage("Não foi possível efetuar esta operação - Tente Novamente!")
        }

        setSnackbarOpen(true)
    }

    function onError( errors ) {
        setSnackbarMessage("Preencha os campos apropriadamente!")
        setSeverityMessage("warning")
        setSnackbarOpen(true) 
    }

    return (
        <div className="flex flex-col flex-1 relative">
            
            <div className="flex flex-row items-center justify-center my-6">
                <Autocomplete 
                    className="w-[18%] min-w-2xs mx-4"
                    disablePortal
                    value={selected}
                    options={options}
                    getOptionLabel={(option) => option ? option.name : option}
                    onInputChange={(event, input) => setSearchInput(input)}
                    onChange={handleChange}
                    loading={loading}
                    noOptionsText={noOptionsText}
                    renderInput={(params) => <TextField {...params} className="custom-textfield-input" label={searchLabel} />}
                />
                <button className="button-submit main-icon" onClick={switchToRegister}>
                    <UserCirclePlus size={32} />
                </button>
            </div>
            <div>
                <Card
                    sx={{mx: 'auto', px: 2, py: 5, bgcolor: 'gray.100', maxWidth: '700px'}}
                    elevation={24}
                >
                    <CardContent sx={{mx: 5, pb: '1rem !important'}}>
                        <form onSubmit={handleSubmit(onSubmit, onError)}>
                            <Grid container spacing={4.5}>
                                {children}
                                <Grid item size={6} 
                                sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <input type="submit" className="button rounded"
                                    value={isRegister ? "Cadastrar" : "Atualizar"} />
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )

}