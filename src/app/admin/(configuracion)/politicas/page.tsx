'use client'
import { CustomDataTable } from "@/components/datatable/CustomDataTable";
import { CriterioOrdenType } from "@/components/datatable/ordenType";
import { Paginacion } from "@/components/datatable/Paginacion";
import { useAuth } from "@/context/AuthProvider";
import { useAlerts } from "@/hooks/useAlerts";
import { useSession } from "@/hooks/useSession";
import { CasbinTypes } from "@/types/casbinTypes";
import { delay, siteName } from "@/utils/utilidades";
import { Button, Chip, Grid, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { RolType } from "../usuarios/types/usuariosCRUDTypes";
import { PoliticaCRUDType } from "./types/PoliticasCRUDTypes";
import { IconoTooltip } from "@/components/botones/IconoTooltip";
import { imprimir } from "@/utils/imprimir";
import { AlertDialog } from "@/components/modales/AlertDialog";
import { CustomDialog } from "@/components/modales/CustomDialog";
import { VistaModalPolitica } from "./ui/ModalPolitica";
import { Constantes } from "@/config/Constantes";
import { ordenFiltrado } from "@/components/datatable/util";
import { InterpreteMensajes } from "@/utils/interpreteMensajes";
import { CustomToggleButton } from "@/components/botones/CustomToggleButton";
import { BotonOrdenar } from "@/components/botones/BotonOrdenar";
import { IconoBoton } from "@/components/botones/IconoBoton";
import { FiltroPolitica } from "./ui/FiltroPoliticas";


export default function PoliticasPage() {
    const [politicaData, setPoliticaData] = useState<PoliticaCRUDType[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [mostrarFiltroPolitica, setMostrarFiltroPolitica] = useState(false)
    const [filtroPolitica, setFiltroPolitica] = useState<string>('')
    const [filtroApp, setFiltroApp] = useState<string>('')
    //hooks de alertas
    const { Alerta } = useAlerts()
    const [errorData, setErrorData] = useState<any>()
    const [modalPolitica, setModalPolitica] = useState(false)

    const [mostrarAlertaEliminarPolitica, setMostrarAlertaEliminarPolitica] =
        useState(false)

    const [politicaEdicion, setPoliticaEdicion] = useState<
        PoliticaCRUDType | undefined
    >()

    // Roles de usuario
    const [rolesData, setRolesData] = useState<RolType[]>([])

    const [limite, setLimite] = useState<number>(10)
    const [pagina, setPagina] = useState<number>(1)
    const [total, setTotal] = useState<number>(0)

    const { sesionPeticion } = useSession()
    const { permisoUsuario } = useAuth()


    const [permisos, setPermisos] = useState<CasbinTypes>({
        read: false,
        create: false,
        update: false,
        delete: false,
    })

    // router para conocer la ruta actual
    const pathname = usePathname()

    const theme = useTheme()
    const xs = useMediaQuery(theme.breakpoints.only('xs'))

    const [ordenCriterios, setOrdenCriterios] = useState<
        Array<CriterioOrdenType>
    >([
        { campo: 'sujeto', nombre: 'Sujeto', ordenar: true },
        { campo: 'objeto', nombre: 'Objeto', ordenar: true },
        { campo: 'accion', nombre: 'Acción', ordenar: true },
        { campo: 'app', nombre: 'App', ordenar: true },
        { campo: 'acciones', nombre: 'Acciones' },
    ])

    const contenidoTabla = politicaData.map(
        (politicaData, indexPolitica) => [
            <Typography
                key={`${politicaData.sujeto}-${indexPolitica}-sujeto`}
                variant={'body2'}
            >{`${politicaData.sujeto}`}
            </Typography>,
            <Typography
                key={`${politicaData.objeto}-${indexPolitica}-objeto`}
                variant={'body2'}
            >{`${politicaData.objeto}`}
            </Typography>,
            <Grid key={`${politicaData.accion}-${indexPolitica}-accion`}>
                {politicaData.accion.split('|').map((itemAccion, indexAccion) => (
                    <Chip
                        key={`accion-${indexPolitica}-${indexAccion}`}
                        label={itemAccion}
                    />
                ))}
            </Grid>,
            <Typography
                key={`${politicaData.accion}-${indexPolitica}-app`}
                variant={'body2'}
            >{`${politicaData.app}`}
            </Typography>,
            <Stack
                key={`${politicaData.accion}-${indexPolitica}-acciones`}
                direction={'row'}
                alignItems={'center'}
            >
                {permisos.update && (
                    <IconoTooltip
                        id={`editarPolitica-${indexPolitica}`}
                        titulo={'Editar'}
                        color={'primary'}
                        accion={() => {
                            imprimir('Editando: ', politicaData)
                            editarPoliticaModal(politicaData)
                        }}
                        icono={'edit'}
                        name={'Editar Politica'}
                    />
                )}

                {permisos.delete && (
                    <IconoTooltip
                        id={`eliminarPolitica-${indexPolitica}`}
                        titulo={'Eliminar'}
                        color={'error'}
                        accion={() => {
                            imprimir('Eliminando: ', politicaData)
                            eliminarPoliticaModal(politicaData)
                        }}
                        icono={'delete_outline'}
                        name={'Eliminar Política'}
                    />
                )}
            </Stack>
        ]
    )

    const acciones = [
        <CustomToggleButton
            id={'accionFiltrarPoliticasToggle'}
            key={'accionFiltrarPoliticasToggle'}
            icono="search"
            seleccionado={mostrarFiltroPolitica}
            cambiar={setMostrarFiltroPolitica}
        />,
        xs && (
            <BotonOrdenar
                id={'ordenarUsuarios'}
                key={'ordenarUsuarios'}
                label={'Ordenar políticas'}
                criterios={ordenCriterios}
                cambioCriterios={setOrdenCriterios}
            />
        ),
        <IconoTooltip
            id={'actualizarPolitica'}
            titulo={'Actualizar'}
            key={'accionActualizarPolitica'}
            accion={async () => {
                await obtenerPoliticasPeticion()
            }}
            icono={'refresh'}
            name={'Actualizar lista de políticas'}
        />,
        permisos.create && (
            <IconoBoton
                id={'agregarPolitica'}
                key={'agregarPolitica'}
                texto={'Agregar'}
                variante={xs ? 'icono' : 'boton'}
                icono={'add_circle_outline'}
                descripcion={'Agregar politica'}
                accion={() => {
                    agregarPoliticaModal()
                }}
            />
        ),
    ]

    const obtenerPoliticasPeticion = async () => {
        try {
            setLoading(true)
            const respuesta = await sesionPeticion({
                url: `${Constantes.baseUrl}/autorizacion/politicas`,
                params: {
                    pagina: pagina,
                    limite: limite,
                    ...(filtroPolitica.length == 0 ? {} : { filtro: filtroPolitica }),
                    ...(filtroApp.length == 0 ? {} : { aplication: filtroApp }),
                    ...(ordenFiltrado(ordenCriterios).length == 0
                        ? {}
                        : {
                            orden: ordenFiltrado(ordenCriterios).join(','),
                        }),
                },
            })
            setPoliticaData(respuesta.datos?.filas)
            setTotal(respuesta.datos?.total)
            setErrorData(null)
        } catch (e) {
            imprimir('Error al obtener políticas', e)
            setErrorData(e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const eliminarPoliticaPeticion = async (politica: PoliticaCRUDType) => {
        try {
            setLoading(true)
            const respuesta = await sesionPeticion({
                url: `${Constantes.baseUrl}/autorizacion/politicas`,
                method: 'delete',
                params: {
                    sujeto: politica?.sujeto,
                    objeto: politica?.objeto,
                    accion: politica?.accion,
                    app: politica?.app,
                },
            })
            imprimir(`respuesta eliminar politica: ${respuesta}`)
            Alerta({
                mensaje: InterpreteMensajes(respuesta),
                variant: 'success',
            })
            await obtenerPoliticasPeticion()
        } catch (e) {
            imprimir('Error al eliminar política ', e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const agregarPoliticaModal = () => {
        setPoliticaEdicion(undefined)
        setModalPolitica(true)
    }

    const editarPoliticaModal = (politica: PoliticaCRUDType) => {
        setPoliticaEdicion(politica)
        setModalPolitica(true)
    }

    const cerrarModalPolitica = async () => {
        setModalPolitica(false)
        await delay(500)
        setPoliticaEdicion(undefined)
    }

    const eliminarPoliticaModal = (politica: PoliticaCRUDType) => {
        setPoliticaEdicion(politica)
        setMostrarAlertaEliminarPolitica(true)
    }

    const cancelarAlertaEliminarPolitica = () => {
        setMostrarAlertaEliminarPolitica(false)
        setPoliticaEdicion(undefined)
    }

    const aceptarAlertaEliminarPoliticas = async () => {
        setMostrarAlertaEliminarPolitica(false)
        if (politicaEdicion) {
            await eliminarPoliticaPeticion(politicaEdicion)
        }
    }

    const obtenerRolesPeticion = async () => {
        try {
            const respuesta = await sesionPeticion({
                url: `${Constantes.baseUrl}/autorizacion/roles`,
            })
            setRolesData(respuesta.datos)
            setErrorData(null)
        } catch (e) {
            imprimir('Error al obtener roles', e)
            setErrorData(e)
            Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
        } finally {

        }
    }

    async function definirPermisos() {
        setPermisos(await permisoUsuario(pathname))
    }

    useEffect(() => {
        definirPermisos().finally()
    }, [])

    useEffect(() => {
        obtenerRolesPeticion().then(() => {
            obtenerPoliticasPeticion().finally(() => { })
        })
    }, [pagina, limite, filtroApp, JSON.stringify(ordenCriterios), filtroPolitica])
    useEffect(() => {
        if (!mostrarFiltroPolitica) {
            setFiltroPolitica('')
            setFiltroApp('')
        }
    }, [mostrarFiltroPolitica])
    
    const paginacion = <Paginacion
        pagina={pagina}
        limite={limite}
        total={total}
        cambioPagina={setPagina}
        cambioLimite={setLimite}
    />
    return (
        <>
            <title>{`Politicas - ${siteName()}`}</title>
            <AlertDialog
                isOpen={mostrarAlertaEliminarPolitica}
                titulo={'Alerta'}
                texto={`¿Está seguro de eliminar la politica ${politicaEdicion?.app}-${politicaEdicion?.objeto} - ${politicaEdicion?.sujeto}-${politicaEdicion?.accion} ?`}
            >
                <Button variant={'outlined'} onClick={cancelarAlertaEliminarPolitica}>
                    Cancelar
                </Button>
                <Button variant={'contained'} onClick={aceptarAlertaEliminarPoliticas}>
                    Aceptar
                </Button>
            </AlertDialog>
            <CustomDialog
                isOpen={modalPolitica}
                handleClose={cerrarModalPolitica}
                title={politicaEdicion ? 'Editar Política' : 'Nueva Política'}
            >
                <VistaModalPolitica
                    politica={politicaEdicion}
                    roles={rolesData}
                    accionCorrecta={() => {
                        cerrarModalPolitica().finally()
                        obtenerPoliticasPeticion().finally()
                    }}
                    accionCancelar={cerrarModalPolitica}
                />
            </CustomDialog>
            <CustomDataTable
                titulo={'Politicas'}
                error={!!errorData}
                cargando={loading}
                acciones={acciones}
                columnas={ordenCriterios}
                cambioOrdenCriterios={setOrdenCriterios}
                contenidoTabla={contenidoTabla}
                paginacion={paginacion}
                filtros={
                    mostrarFiltroPolitica && (
                        <FiltroPolitica
                            filtroPolitica={filtroPolitica}
                            filtroApp={filtroApp}
                            accionCorrecta={(filtros) => {
                                setPagina(1)
                                setLimite(10)
                                setFiltroPolitica(filtros.buscar)
                                setFiltroApp(filtros.app)
                            }}
                            accionCerrar={() => { }}
                        />
                    )
                }
            />
        </>
    )
}