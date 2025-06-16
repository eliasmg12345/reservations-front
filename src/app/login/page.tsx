'use client'
import { Box, Divider, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import LoginContainer from "./ui/LoginContainer";
import { useFullScreenLoading } from "@/context/FullScreenLoadingProvider";
import { imprimir } from "@/utils/imprimir";
import { useEffect } from "react";
import { delay } from "@/utils/utilidades";
import { Servicios } from "@/services/Servicios";
import { useAlerts } from "@/hooks/useAlerts";
import { InterpreteMensajes } from "@/utils/interpreteMensajes";


export default function LoginPage() {

    const theme = useTheme()
    const sm = useMediaQuery(theme.breakpoints.only('sm'))
    const xs = useMediaQuery(theme.breakpoints.only('xs'))

    const { Alerta } = useAlerts()
    const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

    const obtenerEstado = async () => {
        try {
            mostrarFullScreen()
            await delay(1000)
            const respuesta = await Servicios.get({
                url: '',
                body: {},
                headers: {
                    accept: 'application/json',
                }
            })
            imprimir('se obtuvo el estado: ', respuesta)
        } catch (e) {
            imprimir('Error al obtener estado', e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {
            ocultarFullScreen()
        }
    }
    useEffect(() => {
        obtenerEstado().then(() => { })
    }, [])

    return (
        <Grid container justifyContent="space-evenly" alignItems={'center'}>
            <Grid size={{ xs: 12, md: 5, xl: 6 }}>
                <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    minHeight={sm || xs ? '30vh' : '80vh'}
                    color={'primary'}
                >
                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <Typography
                            variant={'h4'}
                            component="h1"
                            fontWeight={'500'}
                            align={sm || xs ? 'center' : 'left'}
                        >
                            Frontend con Next.js, MUI v7 y Typescript
                        </Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid
                size={{ xl: 0, md: 0, xs: 0 }}
                sx={{
                    display: {
                        sm: 'none',
                        xs: 'none',
                        md: 'block',
                        xl: 'block',
                    },
                }}
            >
                <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    minHeight={'80vh'}
                >
                    <Divider
                        variant={'middle'}
                        sx={{ marginTop: '60px', marginBottom: '60px' }}
                        orientation="vertical"
                        flexItem
                    />
                </Box>
            </Grid>
            <Grid size={{ xl: 4, md: 5, xs: 12 }}>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Box
                        display={'flex'}
                        justifyContent={'space-around'}
                        alignItems={'center'}
                        color={'primary'}
                    >
                        <LoginContainer />
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}