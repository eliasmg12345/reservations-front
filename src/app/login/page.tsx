'use client'
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import LoginContainer from "./ui/LoginContainer";
import { useFullScreenLoading } from "@/context/FullScreenLoadingProvider";
import { imprimir } from "@/utils/imprimir";
import { useEffect } from "react";


export default function LoginPage() {

    const theme = useTheme()
    const sm = useMediaQuery(theme.breakpoints.only('sm'))
    const xs = useMediaQuery(theme.breakpoints.only('xs'))

    const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

    const obtenerEstado = async () => {
        try {

        } catch (e) {
            imprimir('Error al obtener estado', e)
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
                            Frontend vase con Next.js, MUI v7 y Typescript
                        </Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid
                size={{ xl: 0, md: 0, xs: 0 }}
            >

            </Grid>
            <LoginContainer />
        </Grid>
    )
}