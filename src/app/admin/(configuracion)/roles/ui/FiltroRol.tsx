import { useForm } from "react-hook-form"
import { Box, Grid } from "@mui/material"
import { FormInputText } from "@/components/form/FormInputText"
import { useEffect } from "react"
import { useDebouncedCallback } from "use-debounce"


export interface FiltroType {
    rol: string
}

export interface FiltroModalRolType {
    filtroRol: string
    accionCorrecta: (filtros: FiltroType) => void
    accionCerrar: () => void
}

export const FiltroRol = ({
    filtroRol,
    accionCorrecta
}: FiltroModalRolType) => {
    const { control, watch } = useForm<FiltroType>({
        defaultValues: {
            rol: filtroRol
        }
    })

    const rolFiltro: string | undefined = watch('rol')

    const debounced = useDebouncedCallback((filtros: FiltroType) => {
        accionCorrecta(filtros)
    }, 1000)

    const actualizacionFiltros = (filtros: FiltroType) => {
        debounced(filtros)
    }

    useEffect(() => {
        actualizacionFiltros({
            rol: rolFiltro
        })
    }, [rolFiltro])

    return (
        <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                    <FormInputText
                        id={'filtroRol'}
                        name={'rol'}
                        control={control}
                        label={'Buscar Rol'}
                        bgcolor={'background.paper'}
                        clearable
                    />
                </Grid>
            </Grid>
        </Box>
    )
}