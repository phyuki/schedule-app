import { Autocomplete, Snackbar, TextField } from "@mui/material";
import Modal from "./Modal";
import { DatePicker, TimeField } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function ScheduleForm({ setModalVisible, initialProf, refreshSessions }) {

    const { register, control, handleSubmit, watch, reset, formState: { errors } } = useForm({
        defaultValues: {
            subject: '',
            professional: initialProf,
            patient: null,
            date: null,
            startTime: null,
            endTime: null
        }
    })

    const startTime = watch('startTime')
    const selectedProf = watch('professional')

    const [professionals, setProfessionals] = useState([initialProf])
    const [patients, setPatients] = useState([])

    const [inputSelectedProf, setInputSelectedProf] = useState(initialProf?.name ?? '')
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

            if(!(validateTimeRange(newStart, sessionStart, sessionEnd) && 
                validateTimeRange(newEnd, sessionStart, sessionEnd))) {
                    return false
            }
        }

        return true
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

        if(validateSessions(result, session)) {
            try {
                const response = await window.sessionAPI.createSession(session)
                if(response) {
                    setSnackbarMessage("Consulta marcada com sucesso!")
                    refreshSessions(selectedProf)
                } else {
                    setSnackbarMessage("Não foi possível marcar esta consulta - Tente Novamente!")
                    console.log(response)
                }
            } catch (err) {
                console.log(err)
                return
            }
        } else {
            setSnackbarMessage("Este horário não está disponível!")
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