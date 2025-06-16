import { Constantes } from "@/config/Constantes"
import { useFullScreenLoading } from "@/context/FullScreenLoadingProvider"
import { estadosSinPermiso, peticionFormatoMetodo, Servicios } from "@/services/Servicios"
import { eliminarCookie, leerCookie } from "@/utils/cookies"
import { imprimir } from "@/utils/imprimir"
import { verificarToken } from "@/utils/token"
import { delay } from "@/utils/utilidades"


export const useSession = () => {
    const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

    const sesionPeticion = async ({
        url,
        method = 'get',
        body,
        headers,
        params,
        responseType,
        withCredentials,
    }: peticionFormatoMetodo) => {
        try {
            if (!verificarToken(leerCookie('token') ?? '')) {
                imprimir('Token caducado')
                await actualizarSession()
            }

            const cabeceras = {
                accept: 'application/json',
                Authorization: `Bearer ${leerCookie('token') ?? ''}`,
                ...headers
            }

            imprimir('enviando sesion petición', body, method, url, cabeceras)

            const response = await Servicios.peticionHTTP({
                url,
                method: method,
                headers: cabeceras,
                body,
                params,
                responseType,
                withCredentials,
            })
            imprimir('respuesta', body, method, url, response)
            return response.data
        } catch (e: import('axios').AxiosError | any) {
            if (e.code === 'ECONNABORTED') {
                throw new Error('la petición esta tardando demasiado')
            }

            if (Servicios.isNetworkError(e)) {
                throw new Error('error en la conexión')
            }

            if (estadosSinPermiso.includes(e.response?.status)) {
                mostrarFullScreen()
                await cerrarSesion()
                ocultarFullScreen()
                return
            }
            throw e.response?.data || 'Ocurrió un error desconocido'
        }
    }

    const borrarCookiesSession = () => {
        eliminarCookie('token')
        eliminarCookie('jid')
    }

    const cerrarSesion = async () => {
        try {
            mostrarFullScreen()
            await delay(1000)
            const token = leerCookie('token')
            borrarCookiesSession()

            const respuesta = await Servicios.get({
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${token}`
                },
                url: `${Constantes.baseUrl}/logout`,
            })
            imprimir('finalizando con respuesta ', respuesta)

            if (respuesta?.url) {
                window.location.href = respuesta?.url
            } else {
                window.location.reload()
            }
        } catch (e) {
            imprimir('Error al cerrar sesión', e)
            window.location.reload()
        } finally {
            ocultarFullScreen()
        }
    }


    const actualizarSession = async () => {
        imprimir('Actualizando token ')

        try {

        } catch (e) {
            await cerrarSesion
        }
    }

    return { sesionPeticion, cerrarSesion, borrarCookiesSession }
}