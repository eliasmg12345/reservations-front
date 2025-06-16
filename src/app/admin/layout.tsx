'use client'
import { useAuth } from "@/context/AuthProvider";
import { SideBarProvider, useSidebar } from "@/context/SideBarProvider";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode, useEffect } from "react";


const Contenido = ({ children }: { children: ReactNode }) => {
    const { sideMenuOpen } = useSidebar()

    const { progresoLogin } = useAuth()

    const theme = useTheme()

    const sm = useMediaQuery(theme.breakpoints.only('sm'))
    const xs = useMediaQuery(theme.breakpoints.only('xs'))
    const md = useMediaQuery(theme.breakpoints.only('md'))

    useEffect(()=>{
        if (progresoLogin) return

        
    },[progresoLogin])
    return (
        <>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                justifyItems={'center'}
            >
                <Box sx={{ display: 'flex' }}>

                </Box>
                <Box
                    component="main"
                    sx={{
                        width: sm || xs || md ? '100%' : sideMenuOpen ? '80%' : '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        ml: sm || xs || md ? '0%' : sideMenuOpen ? '200px' : '0%',
                        transition: 'all 0.2s ease-out !important',
                    }}
                >

                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="initial"
                        justifyItems={'center'}
                        minHeight={'80vh'}
                    >
                        <div
                            style={{
                                height: '75vh',
                                width: xs || sm ? '90%' : '95%',
                            }}
                        >
                            <Box height={'30px'} />
                            {children}
                        </div>

                    </Grid>

                </Box>
            </Grid>
        </>
    )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <SideBarProvider>
            <Contenido>{children}</Contenido>
        </SideBarProvider>
    )
}