'use client'

import { AlertDialog } from "@/components/modales/AlertDialog"
import { delay, siteName, titleCase } from "@/utils/utilidades"
import { ReactNode, useEffect, useState } from "react"
import { RolType, UsuarioCRUDType } from "@/app/admin/(configuracion)/usuarios/types/usuariosCRUDTypes"
import { Box, Button, Chip, Grid, Stack, Switch, Typography, useMediaQuery, useTheme } from "@mui/material"
import { imprimir } from "@/utils/imprimir"
import { useAlerts } from "@/hooks/useAlerts"
import { InterpreteMensajes } from "@/utils/interpreteMensajes"
import { useSession } from "@/hooks/useSession"
import { Constantes } from "@/config/Constantes"
import { ordenFiltrado } from "@/components/datatable/util"
import { CriterioOrdenType } from "@/components/datatable/ordenType"
import { CustomDialog } from "@/components/modales/CustomDialog"
import { VistaModalUsuario } from "./ui/ModalUsuarios"
import { CustomDataTable } from "@/components/datatable/CustomDataTable"
import { CustomToggleButton } from "@/components/botones/CustomToggleButton"
import { BotonOrdenar } from "@/components/botones/BotonOrdenar"
import { IconoTooltip } from "@/components/botones/IconoTooltip"
import { CasbinTypes } from "@/types/casbinTypes"
import { IconoBoton } from "@/components/botones/IconoBoton"
import { FiltroUsuarios } from "./ui/FiltroUsuarios"
import CustomMensajeEstado from "@/components/estados/CustomMensajeEstado"
import { CustomSwitch } from "@/components/botones/CustomSwitch"
import { useAuth } from "@/context/AuthProvider"
import { usePathname } from "next/navigation"
import { Paginacion } from "@/components/datatable/Paginacion"

export default function UsuariosPage() {
    const [usuariosData, setUsuariosData] = useState<UsuarioCRUDType[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const { Alerta } = useAlerts()
    const [errorData, setErrorData] = useState<any>()
    const [modalUsuario, setModalUsuario] = useState(false)
    const [mostrarAlertaEstadoUsuario, setMostrarAlertaEstadoUsuario] = useState(false)
    const [usuarioEdicion, setUsuarioEdicion] = useState<
        UsuarioCRUDType | undefined | null
    >()

    const [rolesData, setRolesData] = useState<RolType[]>([])

    // Variables de paginado
    const [limite, setLimite] = useState<number>(10)
    const [pagina, setPagina] = useState<number>(1)
    const [total, setTotal] = useState<number>(0)

    //Filtros
    const [filtroUsuario, setFiltroUsuario] = useState<string>('')
    const [filtroRoles, setFiltroRoles] = useState<string[]>([])

    // Indicador para mostrar el filtro de usuarios
    const [mostrarFiltroUsuarios, setMostrarFiltroUsuarios] = useState(false)
    const { sesionPeticion } = useSession()
    const { permisoUsuario } = useAuth()

    //permisos para acciones
    const [permisos, setPermisos] = useState<CasbinTypes>({
        read: false,
        create: false,
        update: false,
        delete: false,
    })
    const theme = useTheme()
    const xs = useMediaQuery(theme.breakpoints.only('xs'))

    //para conocer la ruta actual
    const pathname = usePathname()

    const [ordenCriterios, setOrdenCriterios] = useState<
        Array<CriterioOrdenType>
    >([
        { campo: 'nroDocumento', nombre: 'Nro. Documento', ordenar: true },
        { campo: 'nombres', nombre: 'Nombres', ordenar: true },
        { campo: 'usuario', nombre: 'Usuario', ordenar: true },
        { campo: 'tipo', nombre: 'Tipo' },
        { campo: 'rol', nombre: 'Roles', ordenar: true },
        { campo: 'estado', nombre: 'Estado', ordenar: true },
        { campo: 'acciones', nombre: 'Acciones' },
    ])

    const contenidoTabla: Array<Array<ReactNode>> = usuariosData.map(
        (usuarioData, indexUsuario) => [
            <Typography
                key={`${usuarioData.id}-${indexUsuario}-tipoDoc`}
                variant={'body2'}
            >
                {`${usuarioData.persona.tipoDocumento} ${usuarioData.persona.nroDocumento}`}
            </Typography>,
            <div key={`${usuarioData.id}-${indexUsuario}-nombres`}>
                <Typography variant={'body2'}>
                    {`${usuarioData.persona.nombres} ${usuarioData.persona.primerApellido} ${usuarioData.persona.segundoApellido}`}
                </Typography>
            </div>,
            <Typography
                key={`${usuarioData.id}-${indexUsuario}-usuario`}
                variant={'body2'}
            >
                {usuarioData.usuario}
            </Typography>,
            <Box key={`${usuarioData.id}-${indexUsuario}-tipo`}>
                {usuarioData.ciudadaniaDigital && (
                    <Chip
                        size={'small'}
                        color={'primary'}
                        label="Ciudadania"
                        variant="outlined"
                    />
                )}
                {!usuarioData.ciudadaniaDigital && (
                    <Chip size={'small'} label="Normal" variant="outlined" />
                )}
            </Box>,
            <Grid key={`${usuarioData.id}-${indexUsuario}-roles`}>
                {usuarioData.usuarioRol.map((itemUsuarioRol, indexUsuarioRol) => (
                    <Chip
                        key={`usuario-rol-${indexUsuarioRol}`}
                        label={itemUsuarioRol.rol.rol}
                        sx={{ m: 0.1 }}
                    />
                ))}
            </Grid>,
            <Typography
                component={'div'}
                key={`${usuarioData.id}-${indexUsuario}-estado`}
            >
                <CustomMensajeEstado
                    titulo={usuarioData.estado}
                    descripcion={usuarioData.estado}
                    color={
                        usuarioData.estado == 'ACTIVO'
                            ? 'success'
                            : usuarioData.estado == 'INACTIVO'
                                ? 'error'
                                : 'info'
                    }
                />
            </Typography>,
            <Stack
                key={`${usuarioData.id}-${indexUsuario}-acciones`}
                direction={'row'}
                alignItems={'center'}
            >
                {permisos.update && (
                    <CustomSwitch
                        id={`cambiarEstadoUsuario-${usuarioData.id}`}
                        titulo={usuarioData.estado == 'ACTIVO' ? 'Inactivar' : 'Activar'}
                        accion={() => {
                            editarEstadoUsuarioModal(usuarioData)
                        }}
                        desactivado={usuarioData.estado == 'PENDIENTE'}
                        color={usuarioData.estado == 'ACTIVO' ? 'success' : 'error'}
                        marcado={usuarioData.estado == 'ACTIVO'}
                        name={
                            usuarioData.estado == 'ACTIVO'
                                ? 'Inactivar Usuario'
                                : 'Activar Usuario'
                        }
                    />
                )}
                {(usuarioData.estado == 'ACTIVO' ||
                    usuarioData.estado == 'INACTIVO') && (
                        <IconoTooltip
                            id={`restablecerContrasena-${usuarioData.id}`}
                            titulo={
                                usuarioData.ciudadaniaDigital
                                    ? 'No se puede restablecer la contraseña'
                                    : 'Reestablecer contraseña'
                            }
                            color={'info'}
                            accion={async () => {
                                await 'ToDo Reestablecimiento passowrd'
                            }}
                            desactivado={usuarioData.ciudadaniaDigital}
                            icono={'vpn_key'}
                            name={'Restablecer contraseña'}
                        />
                    )}
                {usuarioData.estado == 'PENDIENTE' && (
                    <IconoTooltip
                        id={`reenviarCorreoActivacion-${usuarioData.id}`}
                        titulo={'Reenviar correo de activacion'}
                        color={'info'}
                        accion={async () => {
                            await 'ToDo reencioCooreoModal'
                        }}
                        desactivado={usuarioData.ciudadaniaDigital}
                        icono={'forward_to_inbox'}
                        name={'Reenviar correo de activación'}
                    />
                )}
                {permisos.update && (
                    <IconoTooltip
                        id={`editarUsusario-${usuarioData.id}`}
                        titulo={'Editar'}
                        color={'primary'}
                        accion={() => {
                            imprimir('Editaremos', usuarioData)
                            editarUsuarioModal(usuarioData)
                        }}
                        icono={'edit'}
                        name={'Editar Usuario'}
                    />
                )}
            </Stack>
        ]
    )

    const acciones: Array<ReactNode> = [
        <CustomToggleButton
            id={'accionFiltrarUsuarioToggle'}
            key={'accionFiltrarUsuarioToggle'}
            icono="search"
            seleccionado={mostrarFiltroUsuarios}
            cambiar={setMostrarFiltroUsuarios}
        />,
        xs && (
            <BotonOrdenar
                id={'ordenarUsuarios'}
                key={'ordenarUsuarios'}
                label={'ordenar Usuarios'}
                criterios={ordenCriterios}
                cambioCriterios={setOrdenCriterios}
            />
        ),
        <IconoTooltip
            id={'actualizarUsuario'}
            titulo={'Actualizar'}
            key={'actualizarUsuario'}
            accion={async () => {
                await obtenerUsuariosPeticion()
            }}
            icono={'refresh'}
            name={'Actualizar lista de usuario'}
        />,
        permisos.create && (
            <IconoBoton
                id={'agregarUsuario'}
                key={'agregarUsuario'}
                texto={'Agregar'}
                variante={xs ? 'icono' : 'boton'}
                icono={'add_circle_outline'}
                descripcion={'Agregar Usuarios'}
                accion={() => {
                    agregarUsuarioModal()
                }}
            />
        ),
    ]

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

    const obtenerRolesPeticion = async () => {
        try {
            setLoading(true)
            const respuesta = await sesionPeticion({
                url: `${Constantes.baseUrl}/autorizacion/roles`,
            })
            setRolesData(respuesta.datos)
            setErrorData(null)
        } catch (e) {
            imprimir('Error al obtener roles', e)
            setErrorData(e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
            throw e
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

    const agregarUsuarioModal = () => {
        setUsuarioEdicion(null)
        setModalUsuario(true)
    }
    //Metodo que abre una ventana modal para un usuario existente
    const editarUsuarioModal = (usuario: UsuarioCRUDType) => {
        setUsuarioEdicion(usuario)
        setModalUsuario(true)
    }
    const cerrarModalUsuario = async () => {
        setModalUsuario(false)
        await delay(500)
        setUsuarioEdicion(null)
    }

    //Metodo que muestra alerta de cambio de estado

    const editarEstadoUsuarioModal = (usuario: UsuarioCRUDType) => {
        setUsuarioEdicion(usuario)
        setMostrarAlertaEstadoUsuario(true)
    }

    const definirPermisos = async () => {
        setPermisos(await permisoUsuario(pathname))
    }

    useEffect(() => {
        imprimir('usuarios...')
        definirPermisos().finally()
    }, [])

    useEffect(() => {
        obtenerRolesPeticion()
            .then(() => {
                obtenerUsuariosPeticion()
                    .catch(() => { })
                    .finally()
            })
            .catch(() => { })
            .finally(() => { })
    }, [
        pagina, limite,
        JSON.stringify(filtroRoles),
        JSON.stringify(ordenCriterios),
        filtroUsuario,
    ])

    useEffect(() => {
        if (!mostrarFiltroUsuarios) {
            setFiltroUsuario('')
            setFiltroRoles([])
        }
    }, [mostrarFiltroUsuarios])
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
            //TODO ALERT RESTABLECER and correo
            <CustomDialog
                isOpen={modalUsuario}
                handleClose={cerrarModalUsuario}
                title={usuarioEdicion ? 'Editar Usuario' : 'Nuevo Usuario'}
            >
                <VistaModalUsuario
                    usuario={usuarioEdicion}
                    roles={rolesData}
                    accionCorrecta={() => {
                        cerrarModalUsuario().finally()
                        obtenerUsuariosPeticion().finally()
                    }}
                    accionCancelar={cerrarModalUsuario}
                />
            </CustomDialog>
            <CustomDataTable
                titulo={'Usuarios'}
                error={!!errorData}
                cargando={loading}
                acciones={acciones}
                columnas={ordenCriterios}
                cambioOrdenCriterios={setOrdenCriterios}
                contenidoTabla={contenidoTabla}
                filtros={
                    mostrarFiltroUsuarios && (
                        <FiltroUsuarios
                            rolesDisponibles={rolesData}
                            filtroRoles={filtroRoles}
                            filtroUsuario={filtroUsuario}
                            accionCorrecta={(filtros) => {
                                setPagina(1)
                                setLimite(10)
                                setFiltroRoles(filtros.roles)
                                setFiltroUsuario(filtros.usuario)
                            }}
                            accionCerrar={() => { }}
                        />
                    )
                }
                paginacion={
                    <Paginacion
                        pagina={pagina}
                        limite={limite}
                        total={total}
                        cambioPagina={setPagina}
                        cambioLimite={setLimite}
                    />
                }
            />
        </>
    )
}

