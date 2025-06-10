import { Autocomplete, TextField } from "@mui/material"
import { useState } from "react"

export default function RegistrationForm ({ value, options, setSearchInput, setSelectedOption, noOptionsText, 
                                            searchLabel, clearForm, handleSubmit, children }) {

    const [loading, setLoading] = useState(false)
    const [buttonLabel, setButtonLabel] = useState("Cadastrar")

    const switchToRegister = () => {
        clearForm()
        setButtonLabel("Cadastrar")
    }
    
    return (
        <div>
            <div className="row-flex center">
                <Autocomplete 
                    disablePortal
                    value={value}
                    options={options}
                    getOptionLabel={(option) => option ? option.name : option}
                    onInputChange={(event, input) => setSearchInput(input)}
                    onChange={(event, selectedOption) => {
                        setSelectedOption(selectedOption)
                        setButtonLabel("Atualizar")
                    }}
                    loading={loading}
                    sx={{width: 300}}
                    noOptionsText={noOptionsText}
                    renderInput={(params) => <TextField {...params} label={searchLabel} />}
                />
                <button className="button" onClick={switchToRegister}>+</button>
            </div>
            <form onSubmit={handleSubmit}>
                {children}
                <input type="submit" className="button" value={buttonLabel} />
            </form>
        </div>
    )

}