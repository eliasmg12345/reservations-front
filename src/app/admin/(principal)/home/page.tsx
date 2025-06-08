'use client'
import { useAuth } from "@/context/AuthProvider";
import { siteName, titleCase } from "@/utils/utilidades";
import { Box, Chip, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const { usuario } = useAuth()
    console.log({usuario});
    
    const router = useRouter()
    return (
        <>
            <title>{`Home - ${siteName()}`}</title>
            <Box>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid>
                        <Typography
                            variant={'h5'}
                            component="h1"
                            sx={{ flexGrow: 1, fontWeight: '600' }}
                        >
                            Bienvenido {titleCase(usuario?.persona?.nombres ?? '')}
                        </Typography>
                        <Chip
                            label={'Administrador'}
                            variant={'outlined'}
                            size={'small'}
                        />
                    </Grid>
                </Grid>
                <Grid>
                    <Box height={'20px'}>
                        <Typography sx={{ fontSize: 14 }}>
                            Puedes ver los siguientes modulos
                        </Typography>
                        <Box height={'5px'} />
                    </Box>
                </Grid>
            </Box>
        </>
    )
}