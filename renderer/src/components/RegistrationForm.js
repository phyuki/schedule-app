import { Autocomplete, TextField } from "@mui/material"

export default function RegistrationForm ({ value, options, setSearchInput, 
                                            handleChange, loading, noOptionsText, 
                                            searchLabel, switchToRegister, handleSubmit, 
                                            children, isRegister }) {
    
    return (
        <div>
            <div className="row-flex center">
                <Autocomplete 
                    disablePortal
                    value={value}
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
            <form className="column-flex center" onSubmit={handleSubmit}>
                {children}
                <input type="submit" className="button" 
                       value={isRegister ? "Cadastrar" : "Atualizar"} />
            </form>
        </div>
    )

}