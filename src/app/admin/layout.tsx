'use client'
import { SideBarProvider, useSidebar } from "@/context/SideBarProvider";
import { Grid } from "@mui/material";
import { ReactNode } from "react";


const Contenido = ({ children }: { children: ReactNode }) => {
    const { sideMenuOpen } = useSidebar()


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
                {children}
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