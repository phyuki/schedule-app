import { Autocomplete, Snackbar, TextField } from "@mui/material";
import Modal from "./Modal";
import { DatePicker, dateTimePickerTabsClasses, TimeField } from "@mui/x-date-pickers";
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
    const selectedProf = watch('professional')

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

    async function registerSession(result, session, toCreate) {
        const message = toCreate ? "cadastrada" : "atualizada"

        if(validateSessions(result, session)) {
            const response = toCreate ? await window.sessionAPI.createSession(session) 
                : await window.sessionAPI.updateSession(defaultContent.id, session)

            if(response) {
                setSnackbarMessage(`Consulta ${message} com sucesso!`)
                refreshSessions(selectedProf)
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
        const formattedDate = data.date.format('YYYY-MM-DD')
        const result = await window.sessionAPI.findSessionsByDate(selectedProf.id, formattedDate)
        
        const session = {
            subject: data.subject,
            date: formattedDate,
            startTime: startTime.format('HH:mm:ss'),
            endTime: data.endTime.format('HH:mm:ss'),
            patientId: data.patient.id,
            professionalId: selectedProf.id
        }

        if(defaultContent.subject) {
            if(validateEqualFields(data)) {
                const filterResult = result.filter(item => item.id !== defaultContent.id)
                registerSession(filterResult, session, false)
            } else {
                setSnackbarMessage("Horário idêntico ao cadastrado!")
            }
        } else {
            registerSession(result, session, true)
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
                <TextField 
                    label="Motivo da consulta"
                    {...register("subject", { validate: (value) => validateIsEmpty(value, true) })}
                    error={!!errors.subject}
                    helperText={errors.subject?.message}
                />
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
                                setLoadingPatient(false)
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
                                    error: !!errors.date,
                                    helperText: errors.date?.message
                                }
                            }}
                        />
                    )} 
                />
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
                        />
                    )}
                />
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
                        />
                    )}
                />
                <input type="submit" className="button" value="Salvar" />
            </form>
        </Modal>
    )
}