'use client'

import Schedule from "@/components/Schedule"
import "@/styles/main-menu.css"
import Image from "next/image"

import { useState } from "react"

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import RegistrationProf from "@/components/RegistrationProf";
import RegistrationPatient from "@/components/RegistrationPatient"
import Progress from "@/components/Progress"

export default function Page () {

    const [content, setContent] = useState('schedule')

    const showContent = () => {
        switch(content) {
            case 'schedule': 
                return <Schedule />
            case 'professionals':
                return <RegistrationProf />
            case 'patients':
                return <RegistrationPatient />
            default:
                return <Progress />
        }
    }

    const formatClassName = (section) => {
        return `main-menu-item ${content === section && 'bg-light-white text-menu'}`
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <div className="flex flex-col">
                <div className="flex flex-row h-20 bg-menu text-light-white justify-evenly border-b-2 border-light-white">
                    <button className={formatClassName('schedule')} onClick={() => setContent('schedule')}>Agenda</button>
                    <button className={formatClassName('professionals')} onClick={() => setContent('professionals')}>Profissionais</button>
                    <button className={formatClassName('patients')} onClick={() => setContent('patients')}>Pacientes</button>
                    <button className={formatClassName('progress')} onClick={() => setContent('progress')}>Evolução</button>
                </div>
                <div className="flex flex-col flex-auto" id="content">
                    {showContent()}
                </div>
            </div>
        </LocalizationProvider>
    )
}