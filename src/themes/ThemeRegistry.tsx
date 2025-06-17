'use client'

import { guardarCookie, leerCookie } from "@/utils/cookies"
import { imprimir } from "@/utils/imprimir"
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material"
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react"
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { lightTheme } from "./light-theme"
import { darkTheme } from "./dark-theme"
import { useDebouncedCallback } from "use-debounce"


const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
    themeMode: ThemeMode
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)
export const useThemeContext = () => useContext(ThemeContext)

export default function ThemeRegistry({ children }: { children: ReactNode }) {
    const isDarkOS = useMediaQuery(DARK_SCHEME_QUERY)
    const isMountRef = useRef(false)
    const [themeMode, setThemeMode] = useState<ThemeMode>(
        isDarkOS ? 'dark' : 'light'
    )

    //El debounce es una técnica que retrasa la ejecución de una función hasta que 
    // haya pasado cierto tiempo desde la última vez que se intentó ejecutar. 
    // Es útil para evitar ejecuciones innecesarias y repetidas 
    const debounced = useDebouncedCallback(() => {
        isMountRef.current = true
    }, 500)

    const guardarModoOscuro = () => {
        setThemeMode('dark')
        guardarCookie('themeMode', 'dak')
        imprimir('Modo Oscuro activado')
    }

    const guardarModoClaro = () => {
        setThemeMode('light')
        guardarCookie('themeMode', 'light')
        imprimir('Modo Claro activado')
    }

    const guardarModoAutomatico = () => {
        setThemeMode(isDarkOS ? 'dark' : 'light')
        guardarCookie('themeMode', isDarkOS ? 'dark' : 'light')
        imprimir('isDarkOS: ', isDarkOS ? 'oscuro' : 'claro')
    }

    const toggleTheme = () => {
        switch (themeMode) {
            case 'light':
                guardarModoOscuro()
                break;
            case 'dark':
                guardarModoClaro()
                break
            default:
        }
    }

    useEffect(() => {
        const themeModeSaved = leerCookie('themeMode')
        imprimir('themeMode', themeModeSaved)

        if (!themeModeSaved) {
            guardarModoAutomatico()
            isMountRef.current = false
            return
        }

        switch (themeModeSaved) {
            case 'dark':
                guardarModoOscuro()
                break;
            case 'light':
                guardarModoClaro()
                break;
            default:
                guardarModoClaro()
                break;
        }
        isMountRef.current = false
        return
    }, [])

    useEffect(() => {
        if (isMountRef.current) {
            guardarModoAutomatico()
        }
        debounced()
    }, [isDarkOS])

    return (
        <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
            <AppRouterCacheProvider>
                <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </AppRouterCacheProvider>
        </ThemeContext.Provider>
    )
}
