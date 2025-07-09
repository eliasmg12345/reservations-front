import { useState } from "react"
import { useForm } from "react-hook-form"
import { useSession } from "@/hooks/useSession"
import { useAlerts } from "@/hooks/useAlerts"
import { delay } from "@/utils/utilidades"
import { InterpreteMensajes } from "@/utils/interpreteMensajes"
import { Constantes } from "@/config/Constantes"
import { Box, Button, DialogActions, DialogContent, Grid } from "@mui/material"
import { FormInputText } from "@/components/form/FormInputText"
import ProgresoLineal from "@/components/progreso/ProgresoLineal"
import { imprimir } from "@/utils/imprimir"
import {
    CrearEditarPoliticaCRUDType,
    guardarPoliticaCRUDType,
    PoliticaCRUDType
} from "@/app/admin/(configuracion)/politicas/types/PoliticasCRUDTypes"
import { RolType } from '@/app/admin/(configuracion)/usuarios/types/usuariosCRUDTypes'
import { FormInputDropdown } from "@/components/form/FormInputDropdown"
import { FormInputAutocomplete } from "@/components/form/FormInputAutocomplete"


export interface ModalPoliticaType {
    politica?: PoliticaCRUDType
    roles: RolType[]
    accionCorrecta: () => void
    accionCancelar: () => void
}
export const VistaModalPolitica = ({
    politica,
    roles,
    accionCorrecta,
    accionCancelar,
}: ModalPoliticaType) => {
    const [loadingModal, setLoadingModal] = useState<boolean>(false)
    const { Alerta } = useAlerts()
    const { sesionPeticion } = useSession()
    const politicaActual: PoliticaCRUDType | undefined = politica
    const opcionesApp: string[] = ['frontend', 'backend']

    const opcionesAccionesFrontend: string[] = [
        'create',
        'read',
        'update',
        'delete',
    ]
    const opcionesAccionesBackend: string[] = [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
    ]
    const { handleSubmit, control, watch, setValue } =
        useForm<CrearEditarPoliticaCRUDType>({
            defaultValues: {
                app: politica?.app,
                accion: politica?.accion
                    .split('|')
                    .map((val) => ({ key: val, value: val, label: val })),
                objeto: politica?.objeto,
                sujeto: politica?.sujeto,
            },
        })
    const valorApp = watch('app')

    const guardarActualizarPolitica = async (data: CrearEditarPoliticaCRUDType) => {
        await guardarActualizarPoliticaPeticion({
            ...data,
            ...{ accion: data.accion.map((value) => value.value).join('|') },
        })
    }

    const guardarActualizarPoliticaPeticion = async (
        politicaNueva: guardarPoliticaCRUDType
    ) => {
        try {
            setLoadingModal(true)
            await delay(1000)
            const respuesta = await sesionPeticion({
                url: `${Constantes.baseUrl}/autorizacion/politicas`,
                method: politicaActual ? 'patch' : 'post',
                body: politicaNueva,
                params: {
                    sujeto: politicaActual?.sujeto,
                    objeto: politicaActual?.objeto,
                    accion: politicaActual?.accion,
                    app: politicaActual?.app,
                }
            })
            Alerta({
                mensaje: InterpreteMensajes(respuesta),
                variant: 'success',
            })
            accionCorrecta()
        } catch (e) {
            imprimir('Error al crear o actualizar Politica', e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {
            setLoadingModal(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(guardarActualizarPolitica)}>
            <DialogContent dividers>
                <Grid container direction={'column'} justifyContent="space-between">
                    <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                        <Grid size={{ xl: 12, sm: 12, md: 6 }}>
                            <FormInputDropdown
                                id={'sujeto'}
                                name="sujeto"
                                control={control}
                                label="Sujeto"
                                disabled={loadingModal}
                                options={roles.map((rol) => ({
                                    key: rol.rol,
                                    value: rol.rol,
                                    label: rol.rol,
                                }))}
                                rules={{ required: 'Este campo es requerido' }}
                            />
                        </Grid>
                        <Grid size={{ xl: 12, sm: 12, md: 6 }}>
                            <FormInputText
                                id={'objeto'}
                                control={control}
                                name="objeto"
                                label="Objeto"
                                disabled={loadingModal}
                                rules={{ required: 'Este campo es requerido' }}
                            />
                        </Grid>
                    </Grid>

                    <Box height={'15px'} />
                    <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                        <Grid size={{ xl: 12, sm: 12, md: 6 }}>
                            <FormInputDropdown
                                id={'app'}
                                name="app"
                                control={control}
                                label="App"
                                disabled={loadingModal}
                                options={opcionesApp.map((app) => ({
                                    key: app,
                                    value: app,
                                    label: app,
                                }))}
                                onChange={(event) => {
                                    imprimir(event.target.value)
                                    setValue('accion', [])
                                }}
                                rules={{ required: 'Este campo es requerido' }}
                            />
                        </Grid>
                        <Grid size={{ xl: 12, sm: 12, md: 6 }}>
                            <FormInputAutocomplete
                                id={'accion'}
                                name="accion"
                                control={control}
                                label="Accion"
                                multiple
                                forcePopupIcon
                                freeSolo
                                newValues
                                disabled={loadingModal}
                                options={(valorApp == 'frontend'
                                    ? opcionesAccionesFrontend
                                    : valorApp == 'backend'
                                        ? opcionesAccionesBackend
                                        : []
                                ).map((opcionAccion) => ({
                                    key: opcionAccion,
                                    value: opcionAccion,
                                    label: opcionAccion,
                                }))}
                                rules={{ required: 'Este campo es requerido' }}
                                getOptionLabel={(option) => option.label}
                                renderOption={(option) => <>{option.label}</>}
                                isOptionEqualToValue={(option, value) =>
                                    option.value == value.value
                                }
                            />
                        </Grid>
                    </Grid>
                    <Box height={'20px'} />
                    <ProgresoLineal mostrar={loadingModal} />
                </Grid>
            </DialogContent>
            <DialogActions
                sx={{
                    my: 1,
                    mx: 2,
                    justifyContent: {
                        lg: 'flex-end',
                        md: 'flex-end',
                        xs: 'center',
                        sm: 'center',
                    }
                }}
            >
                <Button
                    variant={'outlined'}
                    disabled={loadingModal}
                    onClick={accionCancelar}
                >
                    Cancelar
                </Button>
                <Button
                    variant={'contained'}
                    disabled={loadingModal}
                    type={'submit'}
                >
                    Guardar
                </Button>
            </DialogActions>
        </form>
    )
}