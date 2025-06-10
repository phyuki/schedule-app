'use client'

import Schedule from "@/components/Schedule"
import "@/styles/main-menu.css"
import Image from "next/image"

import { useState } from "react"

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import RegistrationProf from "@/components/RegistrationProf";

export default function Page () {

    const [content, setContent] = useState('schedule')

    const showContent = () => {
        switch(content) {
            case 'schedule': 
                return <Schedule />
            case 'professionals':
                return <RegistrationProf />
            default:
                return <p>{content}</p>
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <div className="page-wrapper column-flex">
                <div className="row-flex" id="horizontal-menu">
                    <button onClick={() => setContent('profile')}>
                        <Image className="item-menu" src="/assets/img_icon.png" alt="Logo da Clínica" width={120} height={100}/>
                    </button>
                    <button className="item-menu" onClick={() => setContent('schedule')}>Agenda</button>
                    <button className="item-menu" onClick={() => setContent('professionals')}>Profissionais</button>
                    <button className="item-menu" onClick={() => setContent('patients')}>Pacientes</button>
                    <button className="item-menu" onClick={() => setContent('progress')}>Evolução</button>
                </div>
                <div className="column-flex" id="content">
                    {showContent()}
                </div>
            </div>
        </LocalizationProvider>
    )
}