'use client'
import { FullScreenLoading } from "@/components/progreso/FullScreenLoading";
import { siteName } from "@/utils/utilidades";
import { Box, Toolbar } from "@mui/material";
import { ReactNode, Suspense } from "react";


export default function LoginLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <title>{`${siteName()}`}</title>
            <Box sx={{ display: 'flex' }}>
                <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                    <Toolbar>
                        <Suspense fallback={<FullScreenLoading mensaje={'Cargando ...'} />}>
                            {children}
                        </Suspense>
                    </Toolbar>
                </Box>
            </Box>
        </>
    )
}