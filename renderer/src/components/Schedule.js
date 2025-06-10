import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { Autocomplete, TextField } from "@mui/material";
import { DatePicker, TimeField } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

export default function Schedule () {

    const calendarRef = useRef()

    const [professionals, setProfessionals] = useState([])
    const [patients, setPatients] = useState([])

    const [scheduleProf, setScheduleProf] = useState(null)
    const [inputScheduleProf, setInputScheduleProf] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [sessionProf, setSessionProf] = useState(null)
    const [inputSessionProf, setInputSessionProf] = useState('')
    const [sessionPatient, setSessionPatient] = useState(null)
    const [inputSessionPatient, setInputSessionPatient] = useState('')
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(false)
    const [activeRange, setActiveRange] = useState({start: '', end: ''})

    const [sessionSubject, setSessionSubject] = useState('')
    const [sessionDate, setSessionDate] = useState(null)
    const [sessionStartTime, setSessionStartTime] = useState(null)
    const [sessionEndTime, setSessionEndTime] = useState(null)

    async function fetchProfessionals(search) {
        const result = await window.professionalAPI.searchProfessionals(search)
        setProfessionals(result)
        if(result.length === 0) setLoading(false)
    }

    async function fetchPatients(search) {
        const result = await window.patientAPI.searchPatients(search)
        setPatients(result)
        if(result.length === 0) setLoading(false)
    }

    const changeInput = (input, callbackOptions, callbackFetch) => {
        if(!input || input.length < 3) {
            callbackOptions([])
            return
        }

        setLoading(true)
        callbackFetch(input)
    }

    useEffect(() => {
        changeInput(inputScheduleProf, setProfessionals, fetchProfessionals)
    }, [inputScheduleProf])

    useEffect(() => {
        changeInput(inputSessionProf, setProfessionals, fetchProfessionals)
    }, [inputSessionProf])

    useEffect(() => {
        changeInput(inputSessionPatient, setPatients, fetchPatients)
    }, [inputSessionPatient])

    const showDayHeaderContent = (args) => {
        const date = args.date
        const dates = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

        const weekday = dates[date.getDay()]
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')

        return `${weekday} ${day}/${month}`
    }

    const fetchSessions = async (profId, activeWeek) => {
        await window.sessionAPI.findSessionsByProfessional(profId, activeWeek).then((sessions) => {
            const formattedEvents = sessions.map((session) => {
                const title = session.subject
                const start = session.date + "T" + session.startTime
                const end = session.date + "T" + session.endTime
                return {title, start, end}
            })
            setEvents(formattedEvents)
        })
    }

    const handleDatesSet = async (args) => {
        if(scheduleProf) {
            const start = args.start.toISOString().split('T')[0]
            const end = new Date(args.end.getTime() - 1).toISOString().split('T')[0]
            const activeWeek = {start, end}
            
            const profId = scheduleProf.id

            if((start !== activeRange.start || end !== activeRange.end) && profId) {
                setActiveRange(activeWeek)
                await fetchSessions(profId, activeWeek)
            }
        }
    }

    const fetchCalendarWeek = () => {
        const calendar = calendarRef.current.calendar
        const {start, end} = calendar.currentData.dateProfile.activeRange
        return {start, end}
    }

    const handleChangeScheduleProf = async (event, selectedOption) => {
        if(selectedOption && selectedOption.id) {
            setScheduleProf(selectedOption)
            const profId = selectedOption.id
            const activeWeek = fetchCalendarWeek()

            await fetchSessions(profId, activeWeek)
        } else {
            setEvents([])
        }
    }

    const registerSession = async (event) => {
        event.preventDefault()

        const session = {
            subject: sessionSubject,
            date: sessionDate.format('YYYY-MM-DD'),
            startTime: sessionStartTime.format('HH:mm:ss'),
            endTime: sessionEndTime.format('HH:mm:ss'),
            patientId: sessionPatient.id,
            professionalId: sessionProf.id
        }

        try {
            const response = await window.sessionAPI.registerSession(session)
            if(response) {
                alert("Consulta marcada com sucesso!")
                const activeWeek = fetchCalendarWeek()
                fetchSessions(scheduleProf.id, activeWeek)
                changeModalVisible()
            } else {
                alert("Não foi possível marcar esta consulta - Tente Novamente!")
                console.log(response)
            }
        } catch (err) {
            console.log(err)
            return
        }
    }

    const formatSessionStartTime = () => {
        let hour = 8
        let minute = 0

        if(sessionStartTime){
            hour = sessionStartTime.hour()
            minute = sessionStartTime.minute()
        } 
        return dayjs().hour(hour).minute(minute)
    }

    const changeModalVisible = async () => {
        if(!modalVisible) {
            if(scheduleProf) {
                setProfessionals([scheduleProf])
                setSessionProf(scheduleProf)
            }
        } else {
            setProfessionals([])
            setPatients([])
            setSessionSubject('')
            setSessionDate(null)
            setSessionStartTime(null)
            setSessionEndTime(null)
        }
        setModalVisible(!modalVisible)
    }

    return (
        <div>
            {modalVisible && 
                <Modal callback={changeModalVisible}>
                    <form onSubmit={registerSession}>
                        <TextField 
                            label="Motivo da consulta"
                            value={sessionSubject}
                            onChange={(event) => setSessionSubject(event.target.value)}
                        />
                        <Autocomplete 
                            disablePortal
                            options={professionals}
                            value={sessionProf}
                            getOptionLabel={(option) => option ? option.name : option}
                            onInputChange={(event, input) => setInputSessionProf(input)}
                            onChange={(event, selectedOption) => setSessionProf(selectedOption)}
                            loading={loading}
                            sx={{width: 300}}
                            noOptionsText='Nenhum professional encontrado'
                            renderInput={(params) => <TextField {...params} label="Profissional" />}
                        />
                        <Autocomplete 
                            disablePortal
                            options={patients}
                            getOptionLabel={(option) => option.name}
                            onInputChange={(event, input) => setInputSessionPatient(input)}
                            onChange={(event, selectedOption) => setSessionPatient(selectedOption)}
                            loading={loading}
                            sx={{width: 300}}
                            noOptionsText='Nenhum paciente encontrado'
                            renderInput={(params) => <TextField {...params} label="Paciente" />}
                        />
                        <DatePicker 
                            label='Data da consulta'
                            value={sessionDate}
                            onChange={(input) => setSessionDate(input)}
                            minDate={dayjs()}
                            format="DD/MM/YYYY"
                        />
                        <TimeField 
                            label="Início"
                            value={sessionStartTime}
                            onChange={(input) => setSessionStartTime(input)}
                            format="HH:mm"
                            minTime={dayjs().hour(7).minute(59)}
                            maxTime={dayjs().hour(18).minute(0)}
                        />
                        <TimeField 
                            label='Fim'
                            value={sessionEndTime}
                            onChange={(input) => setSessionEndTime(input)}
                            format="HH:mm"
                            minTime={formatSessionStartTime()}
                            maxTime={dayjs().hour(18).minute(0)}
                        />
                        <input type="submit" className="button" value="Salvar" />
                    </form>
                </Modal>
            }
            <div className="row-flex center header-content">
                <Autocomplete 
                        disablePortal
                        options={professionals}
                        getOptionLabel={(option) => option ? option.name : option}
                        onInputChange={(event, input) => setInputScheduleProf(input)}
                        onChange={handleChangeScheduleProf}
                        loading={loading}
                        sx={{width: 300}}
                        noOptionsText='Nenhum professional encontrado'
                        renderInput={(params) => <TextField {...params} label="Profissional" />}
                />
                <button className="button" onClick={changeModalVisible}>Marcar Apontamento</button>
            </div>
            <FullCalendar
                plugins={[timeGridPlugin]}
                locale={'pt-br'}
                initialView="timeGridWeek"
                contentHeight="auto"
                hiddenDays={[ 0 ]}
                slotMinTime={'06:00:00'}
                slotMaxTime={'19:00:00'}
                slotLabelInterval={'01:00:00'}
                allDaySlot={false}
                dayHeaderContent={showDayHeaderContent}
                headerToolbar={{
                    left: '',
                    center: '',
                    right: 'today prev,next'
                }}
                slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false 
                }}
                ref={calendarRef}
                datesSet={handleDatesSet}
                events={events}
            />
        </div>
    )

}