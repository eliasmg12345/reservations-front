import { useState } from "react"
import { useForm } from "react-hook-form"
import { useSession } from "@/hooks/useSession"
import { useAlerts } from "@/hooks/useAlerts"
import { delay } from "@/utils/utilidades"
import { InterpreteMensajes } from "@/utils/interpreteMensajes"
import { Constantes } from "@/config/Constantes"
import { Box, Button, DialogActions, DialogContent, Grid } from "@mui/material"
import { FormInputText } from "@/components/form/FormInputText"
import { RolCRUDType } from "../types/rolCRUDType"
import ProgresoLineal from "@/components/progreso/ProgresoLineal"
import { imprimir } from "@/utils/imprimir"


export interface ModalRolType {
    rol?: RolCRUDType
    accionCorrecta: () => void
    accionCancelar: () => void
}
export const VistaModalRol = ({
    rol,
    accionCorrecta,
    accionCancelar
}: ModalRolType) => {
    const [loadingModal, setLoadingModal] = useState<boolean>(false)
    const { Alerta } = useAlerts()
    const { sesionPeticion } = useSession()

    const { handleSubmit, control } = useForm<RolCRUDType>({
        defaultValues: {
            id: rol?.id,
            rol: rol?.rol,
            nombre: rol?.nombre,
            descripcion: rol?.descripcion
        },
    })

    const guardarActualizarUsuario = async (data: RolCRUDType) => {
        await guardarActualizarUsuarioPeticion(data)
    }

    const guardarActualizarUsuarioPeticion = async (
        Rol: RolCRUDType
    ) => {
        try {
            setLoadingModal(true)
            await delay(1000)
            const respuesta = await sesionPeticion({
                url: `${Constantes.baseUrl}/autorizacion/roles${Rol.id ? `/${Rol.id}` : ''
                    }`,
                method: !!Rol.id ? 'patch' : 'post',
                body: Rol,
            })
            Alerta({
                mensaje: InterpreteMensajes(respuesta),
                variant: 'success',
            })
            accionCorrecta()
        } catch (e) {
            imprimir('Error al crear o actualizar Rol', e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {
            setLoadingModal(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(guardarActualizarUsuario)}>
            <DialogContent dividers>
                <Grid container direction={'column'} justifyContent="space-between">
                    <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
                        <Grid size={{ xl: 12, sm: 12, md: 12 }}>
                            <FormInputText 
                                id={'rol'}
                                control={control}
                                name="rol"
                                label="Rol"
                                disabled={loadingModal}
                                rules={{required:'Este campo es requerido'}}
                            />
                        </Grid>
                        <Grid size={{ xl: 12, sm: 12, md: 12 }}>
                            <FormInputText 
                                id={'nombre'}
                                control={control}
                                name="nombre"
                                label="Nombre"
                                disabled={loadingModal}
                                rules={{required:'Este campo es requerido'}}
                            />
                        </Grid>
                        <Grid size={{ xl: 12, sm: 12, md: 12 }}>
                            <FormInputText 
                                id={'descripcion'}
                                control={control}
                                name="descripcion"
                                label="Descripcion"
                                multiline
                                disabled={loadingModal}
                                rules={{required:'Este campo es requerido'}}
                                rows={3}
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