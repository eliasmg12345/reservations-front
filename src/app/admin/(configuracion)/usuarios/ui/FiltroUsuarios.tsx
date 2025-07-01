import { useForm } from "react-hook-form"
import { RolType } from "../types/usuariosCRUDTypes"
import { Box, Grid } from "@mui/material"
import { FormInputText } from "@/components/form/FormInputText"
import { FormInputDropdownMultiple } from "@/components/form/FormInputTextDropdownMultiple"
import { useEffect } from "react"
import { useDebouncedCallback } from "use-debounce"


export interface FiltroType {
    usuario: string
    roles: string[]
}

export interface FiltroModalUsuarioType {
    rolesDisponibles: RolType[]
    filtroRoles: string[]
    filtroUsuario: string
    accionCorrecta: (filtros: FiltroType) => void
    accionCerrar: () => void
}

export const FiltroUsuarios = ({
    rolesDisponibles,
    filtroRoles,
    filtroUsuario,
    accionCorrecta
}: FiltroModalUsuarioType) => {
    const { control, watch } = useForm<FiltroType>({
        defaultValues: {
            usuario: filtroUsuario,
            roles: filtroRoles
        }
    })

    const filtroUsuarioWatch: string = watch('usuario')
    const filtroRolesWatch: string[] = watch('roles')

    const debounced = useDebouncedCallback(
        (filtros: FiltroType) => {
            accionCorrecta(filtros)
        },
        1000
    )
    const actualizacionFiltros = (filtros: FiltroType) => {
        debounced(filtros)
    }

    useEffect(() => {
        actualizacionFiltros({
            usuario: filtroUsuarioWatch,
            roles: filtroRolesWatch,
        })
    }, [filtroUsuarioWatch, filtroRolesWatch])

    return (
        <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                    <FormInputText
                        id={'nombre'}
                        name={'usuario'}
                        control={control}
                        label={'Nombre'}
                        bgcolor={'background.paper'}
                        clearable
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                    <FormInputDropdownMultiple
                        id={'roles'}
                        name="roles"
                        control={control}
                        label="Roles"
                        bgcolor={'background.paper'}
                        options={rolesDisponibles.map((rol) => ({
                            key: rol.id,
                            value: rol.id,
                            label: rol.nombre
                        }))}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}