import Cookies, { CookieAttributes } from "js-cookie";
import { imprimir } from "./imprimir";

export const guardarCookie = (
    key: string,
    value: string,
    options?: CookieAttributes
) => {
    Cookies.set(key, value, {
        secure: process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true',
        sameSite: 'strict',
        ...options,
    })
    imprimir('cookie guardado', key, value)
}

export const leerCookie = (key: string): string | undefined => {
    return Cookies.get(key)
}

export const eliminarCookie = (key: string) => {
    imprimir('eliminando cookie', key)
    return Cookies.remove(key)
}

export const eliminarCookies = () => {
    Object.keys(Cookies.get()).forEach((cookieName) => {
        imprimir('eliminando cookies', cookieName)
        Cookies.remove(cookieName)
    })
}