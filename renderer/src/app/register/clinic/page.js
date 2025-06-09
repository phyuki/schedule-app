'use client'

import { useState } from "react";

import IconInput from "@/components/IconInput";

import "@/styles/register-clinic.css"

export default function Page () {

    const [name, setName] = useState('')
    const [img, setImg] = useState(null)

    const handleSubmit = async (event) => {
        event.preventDefault()
        if(!name || name === '') {
            alert('Preencha todos os campos!')
        }
        
        const clinic = await window.clinicAPI.createClinic({name, img})
        
        if(clinic) {
            alert('Clínica cadastrada com sucesso!')
            window.location.href = '/menu'
        } else {
            alert('Erro ao cadastrar clínica - Tente Novamente')
        }
        
    }

    return (
        <form id="register-clinic" onSubmit={handleSubmit}>
            <IconInput id="clinic-img" className="icon" 
            imageId="preview-img" src="/assets/img_icon.png" 
            alt="Preview Image" title="Prévia de Ícone" 
            width={'170px'} height={'170px'} 
            onFileChange={file => setImg(file.name)}
            />
            <input className="clinic-name" type="text" 
            placeholder="Digite o nome da clínica"
            onChange={event => setName(event.target.value)}
            />
            <input className="button" type="submit" value="Cadastrar" />
        </form>
    )
}