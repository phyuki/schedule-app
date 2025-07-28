import { Autocomplete, Grid, Snackbar, TextField } from "@mui/material";
import Modal from "./Modal";
import { DatePicker, TimeField } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function ScheduleForm({ setModalVisible, defaultContent, refreshSessions }) {

    const { register, control, handleSubmit, watch, 
        reset, setError, clearErrors, formState: { errors } } = useForm({
        defaultValues: {
            id: defaultContent.id ?? null, 
            subject: defaultContent.subject ?? '',
            professional: defaultContent.professional ?? null,
            patient: defaultContent.patient ?? null,
            date: dayjs(defaultContent.date, 'YYYY-MM-DD') ?? null,
            startTime: dayjs(defaultContent.startTime, 'HH:mm:ss') ?? null,
            endTime: dayjs(defaultContent.endTime, 'HH:mm:ss') ?? null
        }
    })

    const startTime = watch('startTime')

    const [professionals, setProfessionals] = useState([defaultContent.professional])
    const [patients, setPatients] = useState([defaultContent.patient])

    const [inputSelectedProf, setInputSelectedProf] = useState(defaultContent.professional?.name ?? '')
    const [inputSelectedPatient, setInputSelectedPatient] = useState('')

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
            setLoading(false)
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

    const validateDateField = (date) => {
        if(!date) return 'Campo obrigatório'
        if(date.isBefore(dayjs(), 'day')) return 'Data inválida'
        else return true
    }

    const validateTimeRange = (time, startTime, endTime) => {
        if(!time) return 'Campo obrigatório'

        const start = startTime ?? dayjs().hour(7).minute(59)
        const end = endTime ?? dayjs().hour(18).minute(1)

        if(time.isAfter(start, 'minute') && time.isBefore(end, 'minute')) {
            return undefined
        } else {
            return 'Horário inválido'
        }
    }

    const validateSessions = (sessions, newSession) => {
        const {startTime, endTime} = newSession
        const newStart = dayjs(startTime, 'HH:mm:ss')
        const newEnd = dayjs(endTime, 'HH:mm:ss')

        for(let session of sessions) {
            const sessionStart = dayjs(session.startTime, 'HH:mm:ss')
            const sessionEnd = dayjs(session.endTime, 'HH:mm:ss')

            const validateNewSession = validateTimeRange(newStart.add(1, 'minute'), sessionStart, sessionEnd) && 
                validateTimeRange(newEnd, sessionStart, sessionEnd)
            const validateOldSession = validateTimeRange(sessionStart.add(1, 'minute'), newStart, newEnd) && 
                validateTimeRange(sessionEnd, newStart, newEnd)

            if(!(validateNewSession && validateOldSession)) {
                    return false
            }
        }

        return true
    }

    const validateEqualFields = (data) => {
        const equalSubject = defaultContent.subject === data.subject
        const equalProfessional = defaultContent.professional.id === data.professional.id;
        const equalPatient = defaultContent.patient.id === data.patient.id;
        const equalDate = dayjs(defaultContent.date, 'YYYY-MM-DD').isSame(data.date, 'day')
        const equalStart = dayjs(defaultContent.startTime, 'HH:mm:ss').isSame(data.startTime, 'minute')
        const equalEnd = dayjs(defaultContent.endTime, 'HH:mm:ss').isSame(data.endTime, 'minute')

        return !(equalSubject && equalProfessional && equalPatient && equalDate && equalStart && equalEnd)
    }

    async function registerSession(result, session, professional, toCreate) {
        const message = toCreate ? "cadastrada" : "atualizada"

        if(validateSessions(result, session)) {
            const response = toCreate ? await window.sessionAPI.createSession(session) 
                : await window.sessionAPI.updateSession(defaultContent.id, session)

            if(response) {
                setSnackbarMessage(`Consulta ${message} com sucesso!`)
                refreshSessions(professional)
            } else {
                setSnackbarMessage("Não foi possível marcar esta consulta - Tente Novamente!")
                console.log(response)
            }
        } else {
            const errorMessage = { type: "manual", message: "Horário ocupado" }
            setError("startTime", errorMessage)
            setError("endTime", errorMessage)
            setSnackbarMessage("Este horário não está disponível!")
        }
    }

    const onSubmit = async (data) => {
        const professional = data.professional
        const formattedDate = data.date.format('YYYY-MM-DD')
        const result = await window.sessionAPI.findSessionsByDate(professional.id, formattedDate)
        
        const session = {
            subject: data.subject,
            date: formattedDate,
            startTime: startTime.format('HH:mm:ss'),
            endTime: data.endTime.format('HH:mm:ss'),
            patientId: data.patient.id,
            professionalId: professional.id
        }

        if(defaultContent.subject) {
            if(validateEqualFields(data)) {
                const filterResult = result.filter(item => item.id !== defaultContent.id)
                registerSession(filterResult, session, professional, false)
            } else {
                setSnackbarMessage("Horário idêntico ao cadastrado!")
            }
        } else {
            registerSession(result, session, professional, true)
        }

        clearErrors([["startTime", "endTime"]])
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
                <Grid container spacing={4.5}>
                    <Grid item size={12}>
                        <TextField 
                            label="Motivo da consulta"
                            {...register("subject", { validate: (value) => validateIsEmpty(value, true) })}
                            error={!!errors.subject}
                            helperText={errors.subject?.message}
                            fullWidth
                            className="custom-textfield-input"
                        />
                    </Grid>
                    <Grid item size={6}>
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
                                    sx={{minWidth: '200px'}}
                                    noOptionsText='Nenhum professional encontrado'
                                    renderInput={(params) => 
                                        <TextField {...params} 
                                            label="Profissional" 
                                            error={!!errors.professional}
                                            helperText={errors.professional?.message}
                                            fullWidth
                                            className="custom-textfield-input"
                                        />
                                    }
                                />
                            )}
                        />
                    </Grid>
                    <Grid item size={6}>
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
                                    sx={{minWidth: '200px'}}
                                    noOptionsText='Nenhum paciente encontrado'
                                    renderInput={(params) => 
                                        <TextField {...params} 
                                            label="Paciente" 
                                            error={!!errors.patient}
                                            helperText={errors.patient?.message}
                                            fullWidth
                                            className="custom-textfield-input"
                                        />
                                    }
                                />
                            )}
                        />
                    </Grid>
                    <Grid item size={4}>
                        <Controller
                            name="date"
                            control={control}
                            rules={{ validate: (value) => validateDateField(value) }}
                            render={({ field }) => (
                                <DatePicker 
                                    label='Data da consulta'
                                    {...field}
                                    minDate={dayjs()}
                                    format="DD/MM/YYYY"
                                    slotProps={{
                                        textField:{
                                            fullWidth: true, 
                                            className: 'custom-textfield-input', 
                                            error: !!errors.date,
                                            helperText: errors.date?.message
                                        }
                                    }}
                                />
                            )} 
                        />
                    </Grid>
                    <Grid item size={4}>
                        <Controller
                            name="startTime"
                            control={control}
                            rules={{ validate: (value) => validateTimeRange(value) }}
                            render={({ field }) => (
                                <TimeField 
                                    {...field}
                                    label='Início'
                                    format="HH:mm"
                                    error={!!errors.startTime}
                                    helperText={errors.startTime?.message}
                                    fullWidth
                                    className="custom-textfield-input"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item size={4}>
                        <Controller
                            name="endTime"
                            control={control}
                            rules={{ validate: (value) => validateTimeRange(value, startTime) }}
                            render={({ field }) => (
                                <TimeField 
                                    {...field}
                                    label='Fim'
                                    format="HH:mm"
                                    disabled={!startTime}
                                    error={!!errors.endTime}
                                    helperText={errors.endTime?.message}
                                    fullWidth
                                    className="custom-textfield-input"
                                />
                            )}
                        />
                    </Grid>
                    <input type="submit" className="button mx-auto block" value="Salvar" />
                </Grid>
            </form>
        </Modal>
    )
}