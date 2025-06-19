import { TextField } from "@mui/material";

import RegistrationForm from "./RegistrationForm";
import PhoneInput from "./PhoneInput";
import { Controller, useForm } from "react-hook-form";

export default function RegistrationProf() {
    
    const {control, handleSubmit, setValue, reset, formState: { errors }} = useForm({
        defaultValues: {
            name: '',
            address: '',
            phone: ''
        }
    })

    async function fetchProfessionals(search) {
        return window.professionalAPI.searchProfessionals(search)
    }

    async function createProfessional(professional) {
        const result = await window.professionalAPI.createProfessional(professional)
        
        if(result)
            return {...professional, id: result}

        return result
    }

    async function updateProfessional(professionalId, professional) {
        const result = await window.professionalAPI.updateProfessional(professionalId, professional)
    
        if(result)
            return {...professional, id: professionalId}

        return result
    }

    const validateIsEmpty = (field) => {
        if(field.trim() === '') {
            return "Campo obrigatório"
        } else {
            return undefined
        }
    }

    const validatePhoneNumber = (field) => {
        if(field.trim() === '') return "Campo obrigatório"
        if(field.replace(/\D/g, '').length !== 11) return "Telefone incompleto"
        else return undefined
    }

    function changeFormItems(professional) {
        if(professional) {
            setValue('name', professional.name, { shouldValidate: true })
            setValue('address', professional.address, { shouldValidate: true })
            setValue('phone', professional.phone, { shouldValidate: true })
        } else {
            reset()
        }
    }

    return (
        <RegistrationForm 
            searchLabel={"Profissional"}
            noOptionsText={"Nenhum profissional encontrado"}
            fetchOptions={fetchProfessionals}
            createItem={createProfessional}
            updateItem={updateProfessional}
            handleSubmit={handleSubmit}
            changeFormItems={changeFormItems}
        >
            <Controller
                name="name"
                control={control}
                rules={{ validate: (value) => validateIsEmpty(value) }}
                render={({ field, fieldState }) => 
                    <TextField 
                        {...field}
                        label="Nome completo"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                    />
                }
            />
           <Controller
                name="address"
                control={control}
                rules={{ validate: (value) => validateIsEmpty(value) }}
                render={({ field, fieldState }) => 
                    <TextField 
                        {...field}
                        label="Endereço"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                    />
                }
            />
            <Controller
                name="phone"
                control={control}
                rules={{ validate: (value) => validatePhoneNumber(value) }}
                render={({ field, fieldState }) => 
                    <PhoneInput 
                        value={field.value}
                        onChange={field.onChange}
                        helperText={fieldState.error}
                    />
                }
            />
        </RegistrationForm>
    )
}
