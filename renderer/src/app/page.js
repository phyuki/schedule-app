'use client'

import { useEffect } from "react";

import Image from "next/image";
import "../styles/loading-page.css"
import { CircularProgress, Typography } from "@mui/material";

export default function Home() {

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.location.href = "/menu"
      } catch (err) {
        console.error('Erro Interno - 500: ' + err)
      }
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  return (
      <>
        <Image id="app-logo" src="/assets/logo.png" alt="App Logo" title="App Logo" width={450} height={450} />
        <Typography 
          variant="h3"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "1.25rem",
            fontWeight: 600,
            mt: 6,
            mb: 3,
            color: 'white'
          }}
        >
          Iniciando aplicativo...
        </Typography>
        <CircularProgress sx={{ color: 'white' }} size={50} thickness={5}/>
      </>
  );
}
