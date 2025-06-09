'use client'
import { LoginType, RoleType, UsuarioType } from "@/app/login/types/loginTypes"
import { Constantes } from "@/config/Constantes"
import { Servicios } from "@/services/Servicios"
import { imprimir } from "@/utils/imprimir"
import { delay, encodeBase64 } from "@/utils/utilidades"
import { useRouter } from "next/navigation"
import { createContext, ReactNode, useContext, useState } from "react"


interface ContextProps {
    cargarUsuarioManual: () => Promise<void>
    usuario: UsuarioType | null
    rolUsuario: RoleType | undefined
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

    const router = useRouter()

    const cargarUsuarioManual = async () => {
        try {

        } catch (error: Error | any) {

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

            setUser(respuesta.datos)
            imprimir('Usuarios', respuesta.datos)

            router.replace('/admin/home')
        } catch (e) {
            imprimir('Error al iniciar sesión: ', e)
        } finally {
            setLoading(false)
        }
    }

    const rolUsuario = () => user?.roles.find((rol) => rol.idRol == user?.idRol)

    return (
        <AuthContext.Provider
            value={{
                cargarUsuarioManual,
                usuario: user,
                ingresar: login,
                progresoLogin: loading,
                rolUsuario:rolUsuario()
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)