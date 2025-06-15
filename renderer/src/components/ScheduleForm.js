import { Autocomplete, Snackbar, TextField } from "@mui/material";
import Modal from "./Modal";
import { DatePicker, TimeField } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import { useEffect, useState } from "react";

export default function ScheduleForm({ setModalVisible, initialProf, refreshSessions }) {

    const [professionals, setProfessionals] = useState([initialProf])
    const [patients, setPatients] = useState([])

    const [subject, setSubject] = useState('')
    const [selectedProf, setSelectedProf] = useState(initialProf)
    const [inputSelectedProf, setInputSelectedProf] = useState('')
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [inputSelectedPatient, setInputSelectedPatient] = useState('')
    const [date, setDate] = useState(null)
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)
    
    const [subjectError, setSubjectError] = useState('')
    const [profError, setProfError] = useState('')
    const [patientError, setPatientError] = useState('')
    const [dateError, setDateError] = useState('')
    const [startTimeError, setStartTimeError] = useState('')
    const [endTimeError, setEndTimeError] = useState('')

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [loadingProf, setLoadingProf] = useState(false)
    const [loadingPatient, setLoadingPatient] = useState(false)

    useEffect(() => {
        console.log({subject, selectedProf, selectedPatient, date, startTime, endTime})
    }, [])

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
        if(!input || input.length < 3) {
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

    const validateIsEmpty = (field, isString, setFieldError) => {
        if(!field || (isString && field.trim() === '')) {
            setFieldError('Campo obrigatório')
            return false
        } else {
            setFieldError('')
            return true
        }
    }

    const validateDateField = (date, setFieldError) => {
        if(date && date.isAfter(dayjs(), 'day')) {
            setFieldError('')
            return true
        } else {
            setFieldError('Data inválida')
            return false
        }
    }

    const validateTimeRange = (time, start, end, setFieldError) => {
        if(time && time.isAfter(start.subtract(1, 'minute')) && time.isBefore(end.add(1, 'minute'))) {
            setFieldError('')
            return true
        } else {
            setFieldError('Horário inválido')
            return false
        }
    }

    const validateFields = () => {
        const validateSubject = validateIsEmpty(subject, true, setSubjectError)
        const validateProf = validateIsEmpty(selectedProf, false, setProfError)
        const validatePatient = validateIsEmpty(selectedPatient, false, setPatientError)
        const validateDate = validateDateField(date, setDateError)
        
        const start = dayjs().hour(8).minute(0)
        const end = dayjs().hour(18).minute(0)

        const validateStartTime = validateTimeRange(startTime, start, end, setStartTimeError)
        const validateEndTime = validateTimeRange(endTime, startTime, end, setEndTimeError)

        return validateSubject && validateProf && validatePatient 
            && validateDate && validateStartTime && validateEndTime
    }

    const registerSession = async (event) => {
        event.preventDefault()

        const validation = validateFields()

        if(validation) {
            const session = {
                subject: subject,
                date: date.format('YYYY-MM-DD'),
                startTime: startTime.format('HH:mm:ss'),
                endTime: endTime.format('HH:mm:ss'),
                patientId: selectedPatient.id,
                professionalId: selectedProf.id
            }

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
            setSnackbarMessage("Preencha os campos apropriadamente!")
        }

        setSnackbarOpen(true)
    }

    const closeModal = async () => {
        setSelectedProf(null)
        setProfessionals([])
        setPatients([])
        setSubject('')
        setDate(null)
        setStartTime(null)
        setEndTime(null)

        setModalVisible(false)
    }

    return (
        <Modal callback={closeModal}>
            <Snackbar 
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
            <form onSubmit={registerSession}>
                <TextField 
                    label="Motivo da consulta"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    error={!!subjectError}
                    helperText={subjectError}
                />
                <Autocomplete 
                    disablePortal
                    options={professionals}
                    value={selectedProf}
                    getOptionLabel={(option) => option ? option.name : option}
                    onInputChange={(event, input) => setInputSelectedProf(input)}
                    onChange={(event, selectedOption) => {
                        setSelectedProf(selectedOption)
                        setLoadingProf(false)
                    }}
                    loading={loadingProf}
                    loadingText='Pesquisando...'
                    sx={{width: 300}}
                    noOptionsText='Nenhum professional encontrado'
                    renderInput={(params) => 
                        <TextField {...params} 
                            label="Profissional" 
                            error={!!profError}
                            helperText={profError}
                        />
                    }
                />
                <Autocomplete 
                    disablePortal
                    options={patients}
                    getOptionLabel={(option) => option.name}
                    onInputChange={(event, input) => setInputSelectedPatient(input)}
                    onChange={(event, selectedOption) => {
                        setSelectedPatient(selectedOption)
                        setLoadingPatient(false)
                    }}
                    loading={loadingPatient}
                    loadingText='Pesquisando...'
                    sx={{width: 300}}
                    noOptionsText='Nenhum paciente encontrado'
                    renderInput={(params) => 
                        <TextField {...params} 
                            label="Paciente" 
                            error={!!patientError}
                            helperText={patientError}
                        />
                    }
                />
                <DatePicker 
                    label='Data da consulta'
                    value={date}
                    onChange={(input) => setDate(input)}
                    minDate={dayjs()}
                    format="DD/MM/YYYY"
                    slotProps={{
                        textField:{
                            error: !!dateError,
                            helperText: dateError
                        }
                    }}
                />
                <TimeField 
                    label='Início'
                    value={startTime}
                    onChange={(input) => setStartTime(input)}
                    format="HH:mm"
                    error={!!startTimeError}
                    helperText={startTimeError}
                />
                <TimeField 
                    label='Fim'
                    value={endTime}
                    onChange={(input) => setEndTime(input)}
                    format="HH:mm"
                    error={!!endTimeError}
                    helperText={endTimeError}
                    
                />
                <input type="submit" className="button" value="Salvar" />
            </form>
        </Modal>
    )
}