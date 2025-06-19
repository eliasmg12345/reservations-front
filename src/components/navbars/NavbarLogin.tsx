'use client'

import { useState } from "react"
import { CustomDialog } from "../modales/CustomDialog"
import { AppBar, Box, DialogContent, Toolbar, Typography } from "@mui/material"
import { IconoTooltip } from "../botones/IconoTooltip"
import ThemeSwitcherButton from "../botones/ThemeSwitcherButton"

export const NavbarLogin = () => {
    const [modalAyuda, setModalAyuda] = useState(false)
    const abrirModalAyuda = () => {
        setModalAyuda(true)
    }
    const cerrarModalAyuda = () => {
        setModalAyuda(false)
    }

    return (
        <>
            <CustomDialog
                isOpen={modalAyuda}
                handleClose={cerrarModalAyuda}
                title={'informacion'}
            >
                <DialogContent>
                    <Typography variant={'body2'}>
                        Propuesta del Frontend Base Login Creado por NextJS y Typescript
                    </Typography>
                </DialogContent>
            </CustomDialog>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backdropFilter: 'blur(12px)'
                }}
            >
                <Toolbar>
                    <Box sx={{ flex: 1 }} />
                    <IconoTooltip 
                        id={'ayudaLogin'}
                        name={'Ayuda'}
                        titulo={'Ayuda'}
                        color={'action'}
                        accion={()=>{
                            abrirModalAyuda()
                        }}
                        icono={'help_outline'}
                    />
                    <ThemeSwitcherButton />
                </Toolbar>
            </AppBar>
        </>
    )
}