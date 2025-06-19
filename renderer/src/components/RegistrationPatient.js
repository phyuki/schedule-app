import { TextField } from "@mui/material";

import RegistrationForm from "./RegistrationForm";
import PhoneInput from "./PhoneInput";
import { Controller, useForm } from "react-hook-form";

export default function RegistrationPatient() {

    const {control, handleSubmit, setValue, reset, formState: { errors }} = useForm({
        defaultValues: {
            name: '',
            address: '',
            phone: ''
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
        if(field.replace(/\D/g, '').length !== 11) return "Telefone incompleto"
        else return undefined
    }

    function changeFormItems(patient) {
        if(patient) {
            setValue('name', patient.name, { shouldValidate: true })
            setValue('address', patient.address, { shouldValidate: true })
            setValue('phone', patient.phone, { shouldValidate: true })
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