import dayjs from "dayjs"
import { imprimir } from "./imprimir"


export const formatoFecha = (fecha: string, formatoNuevo: string): string => {
    imprimir(`${fecha} -> ${formatoNuevo}:${dayjs(fecha).format(formatoNuevo)}`)
    return dayjs(fecha).format(formatoNuevo)
}

export const validarFechaFormato = (date: string, format: string) => {
    imprimir(`${date} -> ${dayjs(date).format(format)}`)
    return dayjs(dayjs(date).format(format), format, true).isValid()
}