import { imprimir } from "@/utils/imprimir"
import axios, { AxiosError, Method, RawAxiosRequestHeaders, ResponseType } from "axios"

export type peticionFormatoMetodo = {
    method?: Method
} & peticionFormato

export type peticionFormato = {
    url: string
    headers?: RawAxiosRequestHeaders
    body?: object
    params?: any
    responseType?: ResponseType
    withCredentials?: boolean
}

export const estadosCorrectos: number[] = [200, 201, 202, 204]
class ServiciosClass {
    peticionHTTP = ({
        url,
        method = 'get',
        headers,
        body,
        params,
        responseType,
        withCredentials
    }: peticionFormatoMetodo) => axios({
        method: method,
        url: url,
        headers: headers,
        timeout: 30000,
        data: body,
        params: params,
        responseType: responseType,
        withCredentials: withCredentials,
        validateStatus(status) {
            return estadosCorrectos.some((estado: number) => status === estado)
        }
    })

    isNetworkError(err: AxiosError | any) {
        return !!err.isAxiosError && !err.response
    }
    async peticion({
        url,
        method = 'get',
        headers,
        body,
        params,
        responseType,
        withCredentials = true
    }: peticionFormatoMetodo) {
        try {
            imprimir('enviando', body, method, url, headers)
            const response = await this.peticionHTTP({
                url,
                method: method,
                headers,
                body,
                params,
                responseType,
                withCredentials
            })
            imprimir('respuesta', body, method, url, response)
            return response.data
        } catch (e: AxiosError | any) {
            if (e.code === 'ECONNABORTED') {
                throw new Error('La peticion está trabajando demasiado')
            }
            if (this.isNetworkError(e)) {
                throw new Error('Error en la conexión')
            }

            throw e.response?.data || 'Error desconocido'
        }
    }
    async post({
        url,
        body,
        headers,
        params,
        responseType,
        withCredentials
    }: peticionFormato) {
        return await this.peticion({
            url,
            method: 'post',
            headers,
            body,
            params,
            responseType,
            withCredentials,
        })
    }
}


export const Servicios = new ServiciosClass()