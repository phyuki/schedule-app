"use client";

import { createTheme, ThemeProvider } from "@mui/material";
import { Montserrat, Poppins, Roboto } from "next/font/google";

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const theme = createTheme({
  typography: {
    fontFamily: montserrat.style.fontFamily,
    body1: {
      fontFamily: montserrat.style.fontFamily,
      fontWeight: 400,
    },
  },
});

export default function ThemeRegistry({ children }) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}
