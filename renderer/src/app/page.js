'use client'

import { useEffect } from "react";

import Image from "next/image";
import "../styles/loading-page.css"

export default function Home() {

  useEffect(() => {

    setTimeout(() => {
        window.clinicAPI.searchClinic().then((exists) => {
            if(exists) {
              window.location.href = "/menu"
            } 
            else {
              window.location.href = "/register/clinic"
            }
        }).catch((err) => {
            console.error('Erro Interno - 500: ' + err)
        })
    }, 4000)
  }, [])

  return (
      <div>
        <Image id="app-logo" src="/assets/logo.png" alt="App Logo" title="App Logo" width={450} height={450} />
        <Image id="loading" src="/assets/loading_1.gif" alt="Loading Icon" width={100} height={100}/>
      </div>
  );
}
