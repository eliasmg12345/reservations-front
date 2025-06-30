import dayjs from "dayjs"
import { imprimir } from "./imprimir"


export const formatoFecha = (fecha: string, formatoNuevo: string): string => {
    imprimir(`${fecha} -> ${formatoNuevo}:${dayjs(fecha).format(formatoNuevo)}`)
    return dayjs(fecha).format(formatoNuevo)
}