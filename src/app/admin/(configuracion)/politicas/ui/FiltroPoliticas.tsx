import { useForm } from "react-hook-form"
import { Box, Grid } from "@mui/material"
import { FormInputText } from "@/components/form/FormInputText"
import { useEffect } from "react"
import { useDebouncedCallback } from "use-debounce"
import { FormInputDropdown } from "@/components/form/FormInputDropdown"

export interface FiltroType {
    buscar: string
    app: string
}

export interface FiltroModalPoliticasType {
    filtroPolitica: string
    filtroApp: string
    accionCorrecta: (filtros: FiltroType) => void
    accionCerrar: () => void
}

export const FiltroPolitica = ({
    filtroPolitica,
    filtroApp,
    accionCorrecta
}: FiltroModalPoliticasType) => {
    const { control, watch } = useForm<FiltroType>({
        defaultValues: {
            buscar: filtroPolitica,
            app: filtroApp,
        },
    })

    const filtroBuscarWatch: string | undefined = watch('buscar')
    const filtroAppWatch: string | undefined = watch('app')

    const debounced = useDebouncedCallback((filtros: FiltroType) => {
        accionCorrecta(filtros)
    }, 1000)

    const actualizacionFiltros = (filtros: FiltroType) => {
        debounced(filtros)
    }

    const lapp: string[] = ['frontend', 'backend']

    useEffect(() => {
        actualizacionFiltros({
            buscar: filtroBuscarWatch,
            app: filtroAppWatch
        })
    }, [filtroBuscarWatch, filtroAppWatch])

    return (
        <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                    <FormInputText
                        id={'buscar'}
                        name={'buscar'}
                        control={control}
                        label={'Filtro'}
                        bgcolor={'background.paper'}
                        clearable
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                    <FormInputDropdown
                        id={'apps'}
                        name={'app'}
                        control={control}
                        label={'App'}
                        options={lapp.map((la) => ({
                            key: la,
                            value: la,
                            label: la,
                        }))}
                        bgcolor={'background.paper'}
                        clearable
                    />
                </Grid>
            </Grid>
        </Box>
    )
}