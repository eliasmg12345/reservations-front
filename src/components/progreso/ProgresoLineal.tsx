import { Box, LinearProgress } from "@mui/material"

interface ProgresoLinealType {
    mostrar?: boolean
}

export default function ProgresoLineal({ mostrar = true }: ProgresoLinealType) {

    return mostrar ? (
        <Box sx={{ width: '100%' }}>
            <LinearProgress />
        </Box>
    ) : null
    
}