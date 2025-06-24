'use client'
import { idRolType, LoginType, RoleType, UsuarioType } from "@/app/login/types/loginTypes"
import { Constantes } from "@/config/Constantes"
import { useSession } from "@/hooks/useSession"
import { Servicios } from "@/services/Servicios"
import { guardarCookie, leerCookie } from "@/utils/cookies"
import { imprimir } from "@/utils/imprimir"
import { delay, encodeBase64 } from "@/utils/utilidades"
import { useRouter } from "next/navigation"
import { createContext, ReactNode, useContext, useState } from "react"
import { useFullScreenLoading } from "./FullScreenLoadingProvider"


interface ContextProps {
    cargarUsuarioManual: () => Promise<void>
    inicializarUsuario: () => Promise<void>
    estaAutenticado: boolean
    usuario: UsuarioType | null
    rolUsuario: RoleType | undefined
    setRolUsuario: ({ idRol }: idRolType) => Promise<void>
    ingresar: ({ usuario, contrasena }: LoginType) => Promise<void>
    progresoLogin: boolean
}

const AuthContext = createContext<ContextProps>({} as ContextProps)

interface AuthContextType {
    children: ReactNode
}
export const AuthProvider = ({ children }: AuthContextType) => {

    const [user, setUser] = useState<UsuarioType | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

    const router = useRouter()

    const { sesionPeticion, borrarCookiesSession } = useSession()

    const inicializarUsuario = async () => {
        const token = leerCookie('token')

        if (!token) {
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            mostrarFullScreen()
            await obtenerUsuarioRol()
            //todo obtener permisos
            await delay(1000)
        } catch (error: Error | any) {
            imprimir('Error durante la inicializarUsuario', typeof error, error)
            borrarSesionUsuario()

            router.replace('/login')
            throw error
        } finally {
            setLoading(false)
            ocultarFullScreen()
        }
    }

    const borrarSesionUsuario = () => {
        setUser(null)
        borrarCookiesSession()
    }

    const cargarUsuarioManual = async () => {
        try {
            await obtenerUsuarioRol()
            //todo
            //await obtenerPersmisos()

            mostrarFullScreen()
            await delay(1000)
            router.replace('/admin/home')
        } catch (error: Error | any) {
            imprimir('Error durante cargarUsuarioManual', error)
            borrarSesionUsuario()

            imprimir(`🚨 -> login`)
            router.replace('/login')
            throw error
        } finally {
            ocultarFullScreen()
        }
    }

    const login = async ({ usuario, contrasena }: LoginType) => {
        try {
            setLoading(true)

            await delay(1000)
            const respuesta = await Servicios.post({
                url: `${Constantes.baseUrl}/auth`,
                body: { usuario, contrasena: encodeBase64(encodeURI(contrasena)) },
                headers: {},
            })
            guardarCookie('token', respuesta.datos?.access_token)
            imprimir(`Token ✅: ${respuesta.datos?.access_token}`)

            setUser(respuesta.datos)
            imprimir('Usuarios', respuesta.datos)

            mostrarFullScreen()
            await delay(1000)
            router.replace('/admin/home')
            await delay(1000)
        } catch (e) {
            imprimir('Error al iniciar sesión: ', e)
            borrarSesionUsuario()
        } finally {
            setLoading(false)
            ocultarFullScreen()
        }
    }

    const obtenerUsuarioRol = async () => {
        const respuestaUsuario = await sesionPeticion({
            url: `${Constantes.baseUrl}/usuarios/cuenta/perfil`
        })

        setUser(respuestaUsuario.datos)
        imprimir(
            `Rol definido en obtenerUsuarioRol: ${respuestaUsuario.datos.idRol}`
        )
    }

    const cambiarRol = async ({ idRol }: idRolType) => {
        try {
            imprimir(`Cambiando rol 👮‍♂️: ${idRol}`)
            await actualizarRol({ idRol })
            router.replace('/admin/home')
        } catch (error) {
            imprimir('error al cambiar de rol ', typeof error, error)
            borrarSesionUsuario()
            router.replace('/login')
        }
    }

    const actualizarRol = async ({ idRol }: idRolType) => {
        const respuestaUsuario = await sesionPeticion({
            method: 'patch',
            url: `${Constantes.baseUrl}/cambiarRol`,
            body: {
                idRol,
            },
        })

        guardarCookie('token', respuestaUsuario.datos?.access_token)
        imprimir(`Token ✅: ${respuestaUsuario.datos?.access_token}`)

        setUser(respuestaUsuario.datos)
        imprimir(`Rol definido en obtenerUsuarioRol : ${respuestaUsuario.datos.idRol}`)
    }

    const rolUsuario = () => user?.roles.find((rol) => rol.idRol == user?.idRol)

    return (
        <AuthContext.Provider
            value={{
                cargarUsuarioManual,
                inicializarUsuario,
                estaAutenticado: !!user && !loading,
                usuario: user,
                setRolUsuario: cambiarRol,
                ingresar: login,
                progresoLogin: loading,
                rolUsuario: rolUsuario()
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)