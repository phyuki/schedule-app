import { Grid, TextField } from "@mui/material";

import RegistrationForm from "./RegistrationForm";
import PhoneInput from "./PhoneInput";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export default function RegistrationPatient() {

    const {control, handleSubmit, setValue, reset, formState: { errors }} = useForm({
        defaultValues: {
            name: '',
            address: '',
            phone: '',
            cpf: '',
            birthDate: null
        }
    })

    async function fetchPatients(search) {
        return window.patientAPI.searchPatients(search)
    }

    async function createPatient(patient) {
        const result = await window.patientAPI.createPatient(patient)

        if(result)
            return {...patient, id: result}

        return result
    }

    async function updatePatient(patientId, patient) {
        const result = await window.patientAPI.updatePatient(patientId, patient)
        
        if(result)
            return {...patient, id: patientId}

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
        if(field.replace(/\D/g, '').length !== 11) return "Telefone inválido"
        else return undefined
    }

    const validateDateField = (date) => {
        if(!date) return 'Campo obrigatório'
        if(!dayjs(date).isValid() || date.isAfter(dayjs(), 'day')) return 'Data inválida'
        else return true
    }

    function changeFormItems(patient) {
        if(patient) {
            setValue('name', patient.name, { shouldValidate: true })
            setValue('address', patient.address, { shouldValidate: true })
            setValue('phone', patient.phone, { shouldValidate: true })
            setValue('cpf', professional.cpf, { shouldValidate: true })
            setValue('birthDate', professional.birthDate.format('YYYY-MM-DD'), { shouldValidate: true })
        } else {
            reset()
        }
    }

    return (
        <RegistrationForm 
            searchLabel={"Paciente"}
            noOptionsText={"Nenhum paciente encontrado"}
            fetchOptions={fetchPatients}
            createItem={createPatient}
            updateItem={updatePatient}
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
                        <PhoneInput 
                            value={field.value}
                            onChange={field.onChange}
                            helperText={fieldState.error}
                            fullWidth
                            className="custom-textfield-input"
                        />
                    }
                />
            </Grid>
        </RegistrationForm>
    )
}