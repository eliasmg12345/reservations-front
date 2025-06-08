import { Constantes } from "@/config/Constantes"


export const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export const encodeBase64 = (data: string) => {
    return Buffer.from(data).toString('base64')
}
export const siteName = () => {
    return Constantes.siteName ?? ''
}

export const titleCase = (word: string) => {
    return word.length <= 1
        ? word.toUpperCase()
        : word
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
}