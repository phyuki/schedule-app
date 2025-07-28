import { Grid, TextField } from "@mui/material";

import RegistrationForm from "./RegistrationForm";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { CpfMaskCustom, PhoneMaskCustom } from "./Masks";

export default function RegistrationProf() {
    
    const {control, handleSubmit, setValue, reset, formState: { errors }} = useForm({
        defaultValues: {
            name: '',
            address: '',
            phone: '',
            cpf: '',
            birthDate: null
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

    const validateDateField = (date) => {
        if(!date) return 'Campo obrigatório'
        if(!dayjs(date).isValid() || date.isAfter(dayjs(), 'day')) return 'Data inválida'
        else return true
    }

    function changeFormItems(professional) {
        if(professional) {
            setValue('name', professional.name, { shouldValidate: true })
            setValue('address', professional.address, { shouldValidate: true })
            setValue('phone', professional.phone, { shouldValidate: true })
            setValue('cpf', professional.cpf, { shouldValidate: true })
            setValue('birthDate', professional.birthDate.format('YYYY-MM-DD'), { shouldValidate: true })
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
            <Grid item size={12}>
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
                            fullWidth
                            className="custom-textfield-input"
                        />
                    }
                />
            </Grid>
            <Grid item size={12}>
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
                            fullWidth
                            className="custom-textfield-input"
                        />
                    }
                />
            </Grid>
            <Grid item size={6}>
                <Controller
                    name="cpf"
                    control={control}
                    rules={{ validate: (value) => validateIsEmpty(value) }}
                    render={({ field, fieldState }) => 
                        <TextField 
                            {...field}
                            label="CPF"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            fullWidth
                            className="custom-textfield-input"
                            slotProps={{
                                input: {
                                    inputComponent: CpfMaskCustom
                                }
                            }}
                        />
                    }
                />
            </Grid>
            <Grid item size={6}>
                <Controller
                    name="birthDate"
                    control={control}
                    rules={{ validate: (value) => validateDateField(value) }}
                    render={({ field }) => (
                        <DatePicker 
                            label='Data de nascimento'
                            {...field}
                            format="DD/MM/YYYY"
                            slotProps={{
                                textField: {
                                    fullWidth: true, 
                                    className: 'custom-textfield-input', 
                                    error: !!errors.birthDate,
                                    helperText: errors.birthDate?.message
                                }
                            }}
                        />
                    )} 
                />
            </Grid>
            <Grid item size={6}>
                <Controller
                    name="phone"
                    control={control}
                    rules={{ validate: (value) => validatePhoneNumber(value) }}
                    render={({ field, fieldState }) => 
                        <TextField 
                            {...field}
                            label="Telefone"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            fullWidth
                            className="custom-textfield-input"
                            slotProps={{
                                input: {
                                    inputComponent: PhoneMaskCustom
                                }
                            }}
                        />
                    }
                />
            </Grid>
        </RegistrationForm>
    )
}
