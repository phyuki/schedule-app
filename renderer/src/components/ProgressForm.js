import { Autocomplete, Snackbar, TextField } from "@mui/material";
import Modal from "./Modal";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function ProgressForm({ setModalVisible, defaultContent, refreshProgress }) {

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            id: defaultContent.id ?? null, 
            subject: defaultContent.subject ?? '',
            professional: defaultContent.professional ?? null,
            patient: defaultContent.patient ?? null
        }
    })

    const [professionals, setProfessionals] = useState([defaultContent.professional])
    const [patients, setPatients] = useState([defaultContent.patient])

    const [inputSelectedProf, setInputSelectedProf] = useState(defaultContent.professional?.name ?? '')
    const [inputSelectedPatient, setInputSelectedPatient] = useState(defaultContent.patient?.name ?? '')

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [loadingProf, setLoadingProf] = useState(false)
    const [loadingPatient, setLoadingPatient] = useState(false)

    async function fetchProfessionals(search) {
        const result = await window.professionalAPI.searchProfessionals(search)
        setProfessionals(result)
        setLoadingProf(false)
    }

    async function fetchPatients(search) {
        const result = await window.patientAPI.searchPatients(search)
        setPatients(result)
        setLoadingPatient(false)
    }

    const changeInput = (input, setLoading, callbackOptions, callbackFetch) => {
        if(!input) {
            callbackOptions([])
            return
        } else {
            setLoading(true)
        }

        callbackFetch(input)
    }

    useEffect(() => {
        changeInput(inputSelectedProf, setLoadingProf, setProfessionals, fetchProfessionals)
    }, [inputSelectedProf])

    useEffect(() => {
        changeInput(inputSelectedPatient, setLoadingPatient, setPatients, fetchPatients)
    }, [inputSelectedPatient])

    const validateIsEmpty = (field, isString) => {
        if(!field || (isString && field.trim() === '')) {
            return 'Campo obrigatório'
        } else {
            return true
        }
    }

    const validateEqualFields = (data) => {
        const equalSubject = defaultContent.subject === data.subject
        const equalProfessional = defaultContent.professional.id === data.professional.id;
        const equalPatient = defaultContent.patient.id === data.patient.id;

        return !(equalSubject && equalProfessional && equalPatient)
    }

    async function registerProgress(progress, patient, toCreate) {
        const message = toCreate ? "cadastrada" : "atualizada"

        const response = toCreate ? await window.progressAPI.createProgress(progress) 
            : await window.progressAPI.updateProgress(defaultContent.id, progress)

        if(response) {
            setSnackbarMessage(`Evolução ${message} com sucesso!`)
            refreshProgress(patient)
        } else {
            setSnackbarMessage("Não foi possível marcar esta consulta - Tente Novamente!")
            console.log(response)
        }
    } 

    const onSubmit = async (data) => {
        const patient = data.patient

        const progress = {
            subject: data.subject,
            patientId: patient.id,
            professionalId: data.professional.id
        }

        if(defaultContent.subject) {
            if(validateEqualFields(data)) {
                registerProgress(progress, patient, false)
            } else {
                setSnackbarMessage("Não houve alteração nas informações")
            }
        } else {
            registerProgress(progress, patient, true)
        }

        setSnackbarOpen(true)
    }

    const onError = (errors) => {
        setSnackbarMessage("Preencha os campos apropriadamente!")
        setSnackbarOpen(true) 
    }

    const handleCLose = async () => {
        setProfessionals([])
        setPatients([])
        reset()

        setModalVisible(false)
    }

    return (
        <Modal callback={handleCLose}>
            <Snackbar 
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
            <form onSubmit={handleSubmit(onSubmit, onError)}>
                <Controller
                    name="professional"
                    control={control}
                    rules={{ validate: (value) => validateIsEmpty(value, false) }}
                    render={({ field }) => (
                        <Autocomplete 
                            {...field}
                            disablePortal
                            value={field.value}
                            options={professionals}
                            getOptionLabel={(option) => option ? option.name : option}
                            onInputChange={(event, input) => setInputSelectedProf(input)}
                            onChange={(_, value) => {
                                field.onChange(value)
                                setLoadingProf(false)
                            }}
                            loading={loadingProf}
                            loadingText='Pesquisando...'
                            sx={{width: 300}}
                            noOptionsText='Nenhum professional encontrado'
                            renderInput={(params) => 
                                <TextField {...params} 
                                    label="Profissional" 
                                    error={!!errors.professional}
                                    helperText={errors.professional?.message}
                                />
                            }
                        />
                    )}
                />
                <Controller
                    name="patient"
                    control={control}
                    rules={{ validate: (value) => validateIsEmpty(value, false) }}
                    render={({ field }) => (
                        <Autocomplete 
                            {...field}
                            disablePortal
                            value={field.value}
                            options={patients}
                            getOptionLabel={(option) => option.name}
                            onInputChange={(event, input) => setInputSelectedPatient(input)}
                            onChange={(_, value) => {
                                field.onChange(value)
                                setLoadingPatient(false)
                            }}
                            loading={loadingPatient}
                            loadingText='Pesquisando...'
                            sx={{width: 300}}
                            noOptionsText='Nenhum paciente encontrado'
                            renderInput={(params) => 
                                <TextField {...params} 
                                    label="Paciente" 
                                    error={!!errors.patient}
                                    helperText={errors.patient?.message}
                                />
                            }
                        />
                    )}
                />
                <TextField 
                    label="Evolução"
                    multiline
                    rows={5}
                    fullWidth
                    {...register("subject", { validate: (value) => validateIsEmpty(value, true) })}
                    error={!!errors.subject}
                    helperText={errors.subject?.message}
                />
                <input type="submit" className="button" value="Salvar" />
            </form>
        </Modal>
    )
}