'use client'

import { AlertDialog } from "@/components/modales/AlertDialog"
import { delay, siteName, titleCase } from "@/utils/utilidades"
import { useState } from "react"
import { UsuarioCRUDType } from "@/app/admin/(configuracion)/usuarios/types/usuariosCRUDTypes"
import { Button } from "@mui/material"
import { imprimir } from "@/utils/imprimir"
import { useAlerts } from "@/hooks/useAlerts"
import { InterpreteMensajes } from "@/utils/interpreteMensajes"
import { useSession } from "@/hooks/useSession"
import { Constantes } from "@/config/Constantes"
import { ordenFiltrado } from "@/components/database/util"
import { CriterioOrdenType } from "@/components/database/ordenType"

export default function UsuariosPage() {
    const [usuariosData, setUsuariosData] = useState<UsuarioCRUDType[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const { Alerta } = useAlerts()
    const [errorData, setErrorData] = useState<any>()
    const [mostrarAlertaEstadoUsuario, setMostrarAlertaEstadoUsuario] = useState(true)
    const [usuarioEdicion, setUsuarioEdicion] = useState<
        UsuarioCRUDType | undefined | null
    >()

    // Variables de paginado
    const [limite, setLimite] = useState<number>(10)
    const [pagina, setPagina] = useState<number>(1)
    const [total, setTotal] = useState<number>(0)

    //Filtros
    const [filtroUsuario, setFiltroUsuario] = useState<string>('')
    const [filtroRoles, setFiltroRoles] = useState<string[]>([])

    // Indicador para mostrar el filtro de usuarios
    const [mostrarFiltroUsuarios, setMostrarFiltroUsuarios] = useState(false)

    const [ordenCriterios, setOrdenCriterios] = useState<
        Array<CriterioOrdenType>
    >([
        { campo: 'nroDocumento', nombre: 'Nro. Documento', ordernar: true },
        { campo: 'nombres', nombre: 'Nombres', ordernar: true },
        { campo: 'usuario', nombre: 'Usuario', ordernar: true },
        { campo: 'tipo', nombre: 'Tipo' },
        { campo: 'rol', nombre: 'Roles', ordernar: true },
        { campo: 'estado', nombre: 'Estado', ordernar: true },
        { campo: 'acciones', nombre: 'Acciones' },
    ])

    const { sesionPeticion } = useSession()

    const obtenerUsuariosPeticion = async () => {
        try {
            setLoading(true)
            const respuesta = await sesionPeticion({
                url: `${Constantes.baseUrl}/usuarios`,
                params: {
                    pagina: pagina,
                    limite: limite,
                    ...(filtroUsuario.length == 0 ? {} : { filtro: filtroUsuario }),
                    ...(filtroRoles.length == 0 ? {} : { rol: filtroRoles.join(',') }),
                    ...(ordenFiltrado(ordenCriterios).length == 0
                        ? {}
                        : {
                            orden: ordenFiltrado(ordenCriterios).join(','),
                        }),
                },
            })
            setUsuariosData(respuesta.datos?.filas)
            setTotal(respuesta.datos?.total)
            setErrorData(null)
        } catch (e) {
            imprimir(`Error al obtener usuarios`, e)
            setErrorData(e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {
            setLoading(false)
        }
    }
    const cambiarEstadoUsuarioPeticion = async (usuario: UsuarioCRUDType) => {
        try {
            const respuesta = await sesionPeticion({
                url: `${Constantes.baseUrl}/usuarios/${usuario.id}/${usuario.estado == 'ACTIVO' ? 'inactivacion' : 'activacion'
                    }`,
                method: 'patch',
            })
            imprimir(`respuesta inactivar usuario: ${respuesta}`)
            Alerta({
                mensaje: InterpreteMensajes(respuesta),
                variant: 'success'
            })
            await obtenerUsuariosPeticion()
        } catch (e) {
            imprimir('Error al inactivar usuarios', e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {
            setLoading(false)
        }
    }
    const cancelarAlertaEstadoUsuario = async () => {
        setMostrarAlertaEstadoUsuario(false)
        await delay(500)
        setUsuarioEdicion(null)
    }

    const aceptarAlertaEstadoUsuario = async () => {
        setMostrarAlertaEstadoUsuario(false)
        if (usuarioEdicion) {
            await cambiarEstadoUsuarioPeticion(usuarioEdicion)
        }
        setUsuarioEdicion(null)
    }
    return (
        <>
            <title>{`Usuarios - ${siteName()}`}</title>
            <AlertDialog
                isOpen={mostrarAlertaEstadoUsuario}
                titulo={'Alerta'}
                texto={`¿Está seguro de ${usuarioEdicion?.estado == 'ACTIVO' ? 'inactivar' : 'activar'
                    } a ${titleCase(usuarioEdicion?.persona.nombres ?? '')} ?`}
            >
                <Button variant={'outlined'} onClick={cancelarAlertaEstadoUsuario}>
                    Cancelar
                </Button>
                <Button variant={'contained'} onClick={aceptarAlertaEstadoUsuario}>
                    Aceptar
                </Button>
            </AlertDialog>
        </>
    )
}

