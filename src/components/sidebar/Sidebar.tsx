'use client'
import { useAuth } from "@/context/AuthProvider"
import { useSidebar } from "@/context/SideBarProvider"
import { useEffect, useState } from "react"
import { CustomDrawer, SidebarModuloType } from "./CustomDrawer"
import { useMediaQuery, useTheme } from "@mui/system"
import { useFullScreenLoading } from "@/context/FullScreenLoadingProvider"
import { usePathname, useRouter } from "next/navigation"
import { imprimir } from "@/utils/imprimir"

const drawerWidth = 220

export const Sidebar = () => {
    const { sideMenuOpen, closeSideMenu, openSideMenu, checkContentBadge } =
        useSidebar()

    const { usuario, rolUsuario, estaAutenticado, progresoLogin } = useAuth()

    const [modulos, setModulos] = useState<SidebarModuloType[]>([])

    const theme = useTheme()
    const router = useRouter()

    const sm = useMediaQuery(theme.breakpoints.only('sm'))
    const md = useMediaQuery(theme.breakpoints.only('md'))
    const xs = useMediaQuery(theme.breakpoints.only('xs'))

    const { estadoFullScreen } = useFullScreenLoading()

    const pathname = usePathname()

    const interpretarModulos = () => {
        imprimir('Cambio en módulos')

        const rolSeleccionado = usuario?.roles.find(
            (itemRol) => itemRol.idRol == rolUsuario?.idRol
        )

        imprimir('rol Seleccionado', rolSeleccionado)

        setModulos(
            rolSeleccionado?.modulos.map((modulo) => ({ ...modulo, open: true })) ??
            []
        )
        
    }
    console.log({modulos});

    const navigateTo = (url: string) => {
        if (sm || xs || md) {
            closeSideMenu()
        }
        router.push(url)
    }

    useEffect(() => {
        if (sm || xs || md) {
            closeSideMenu()
        } else {
            openSideMenu()
        }
    }, [sm, xs, md])

    useEffect(() => {
        interpretarModulos()
    }, [JSON.stringify(usuario)])

    return (
        <CustomDrawer
            variant={sm || xs || md ? 'temporary' : 'persistent'}
            open={
                sideMenuOpen &&
                estaAutenticado &&
                modulos.length > 0 &&
                !progresoLogin &&
                !estadoFullScreen
            }
            onClose={closeSideMenu}
            sx={{
                width: sideMenuOpen ? drawerWidth : '0',
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box'
                },
                transition: 'all 0.2s ease-out'
            }}
            rutaActual={pathname}
            modulos={modulos}
            setModulos={setModulos}
            navigateTo={navigateTo}
            badgeVariant="primary"
            checkContentBadge={checkContentBadge}
        />

    )
}