import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useRef, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import ScheduleForm from "./ScheduleForm";

export default function Schedule () {

    const calendarRef = useRef()

    const [professionals, setProfessionals] = useState([])

    const [scheduleProf, setScheduleProf] = useState(null)
    const [inputScheduleProf, setInputScheduleProf] = useState('')
    
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [events, setEvents] = useState([])
    const [activeRange, setActiveRange] = useState({start: '', end: ''})

    const [selectedSession, setSelectedSession] = useState({})

    async function fetchProfessionals(search) {
        const result = await window.professionalAPI.searchProfessionals(search)
        setProfessionals(result)
        if(result.length === 0) setLoading(false)
    }

    const changeInput = (input, callbackOptions, callbackFetch) => {
        if(!input) {
            callbackOptions([])
            return
        } else {
            setLoading(true)
        }

        callbackFetch(input)
    }

    useEffect(() => {
        changeInput(inputScheduleProf, setProfessionals, fetchProfessionals)
    }, [inputScheduleProf])

    const showDayHeaderContent = (args) => {
        const date = args.date
        const dates = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

        const weekday = dates[date.getDay()]
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')

        return `${weekday} ${day}/${month}`
    }

    const formatName = (name) => {
        const split = name.split(' ')
        return `${split[0]} ${split[split.length - 1]}`
    }

    const fetchSessions = async (profId, activeWeek) => {
        await window.sessionAPI.findSessionsByProfessional(profId, activeWeek).then((sessions) => {
            const formattedEvents = sessions.map((session) => {
                const patient = formatName(session.patient.name)
                const title = patient + " - " + session.subject
                const start = session.date + "T" + session.startTime
                const end = session.date + "T" + session.endTime
                return { title, start, end, extendedProps: session }
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

    const refreshSessions = (professional) => {
        const activeWeek = fetchCalendarWeek()
        fetchSessions(professional.id, activeWeek)
        setProfessionals([professional])
        setScheduleProf(professional)
        setInputScheduleProf(professional.name)
    }
    
    const handleChangeScheduleProf = async (event, selectedOption) => {
        if(selectedOption && selectedOption.id) {
            setScheduleProf(selectedOption)

            const profId = selectedOption.id
            const activeWeek = fetchCalendarWeek()
            await fetchSessions(profId, activeWeek)
        } else {
            setScheduleProf(null)
            setEvents([])
        }

        setLoading(false)
    }

    const handleCalendarEventClick = (info) => {
        const { extendedProps } = info.event
        setSelectedSession(extendedProps)
        setModalVisible(true)
    }

    return (
        <div>
            { modalVisible && 
                <ScheduleForm 
                    setModalVisible={setModalVisible}
                    defaultContent={selectedSession}
                    refreshSessions={refreshSessions}
                /> 
            }
            <div className="row-flex center header-content">
                <Autocomplete 
                        disablePortal
                        value={scheduleProf}
                        inputValue={inputScheduleProf}
                        options={professionals}
                        getOptionLabel={(option) => option ? option.name : option}
                        onInputChange={(event, input) => setInputScheduleProf(input)}
                        onChange={handleChangeScheduleProf}
                        loading={loading}
                        loadingText='Pesquisando...'
                        sx={{width: 300}}
                        noOptionsText='Nenhum professional encontrado'
                        renderInput={(params) => <TextField {...params} label="Profissional" />}
                />
                <button 
                    className="button" 
                    onClick={() => {
                        setSelectedSession({ professional: scheduleProf })
                        setModalVisible(true)
                    }}
                >Marcar Apontamento</button>
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
                eventClick={handleCalendarEventClick}
            />
        </div>
    )
}