import React, { ReactNode, useState } from "react"
import { CriterioOrdenType } from "../datatable/ordenType"
import { Badge, Box, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material"
import { IconoTooltip } from "./IconoTooltip"
import { Icono } from "../Icono"
import { ToggleOrden } from "../datatable/util"


interface BotonOrdenarParams {
    desactivado?: false
    color?:
    | 'inherit'
    | 'action'
    | 'disabled'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
    cambioCriterios: (nuevosCriterios: Array<CriterioOrdenType>) => void
    criterios: Array<CriterioOrdenType>
    icono?: ReactNode
    label: string
    id: string
}

export const BotonOrdenar = ({
    desactivado = false,
    color = 'primary',
    criterios = [],
    icono = 'swap_vert',
    cambioCriterios,
    label,
    id,
}: BotonOrdenarParams) => {
    const [botonOrdenarAnchorEl, setBotonOrdenarAnchorEl] = useState<null | HTMLElement>(null)

    const desplegarMenu = (event: React.MouseEvent<HTMLElement>) => {
        setBotonOrdenarAnchorEl(event.currentTarget)
    }
    const cerrarMenu = () => {
        setBotonOrdenarAnchorEl(null)
    }
    const [openTooltip, setOpenTooltip] = useState(false)

    const handleTooltipClose = () => {
        setOpenTooltip(false)
    }
    const handleTooltipOpen = () => {
        setOpenTooltip(true)
    }

    return (
        <Tooltip
            title={label}
            onClose={handleTooltipClose}
            open={openTooltip}
            onMouseOver={() => {
                if (!botonOrdenarAnchorEl) handleTooltipOpen()
            }}
        >
            <span>
                <IconButton
                    id={id}
                    aria-label={label}
                    size="small"
                    onClick={(event) => {
                        handleTooltipClose()
                        desplegarMenu(event)
                    }}
                    color="primary"
                >
                    <Badge
                        color="secondary"
                        variant="dot"
                        badgeContent={
                            criterios.filter((value) => value.ordernar && value.orden).length
                        }
                    >
                        <Icono color={desactivado ? 'disabled' : color}>{icono}</Icono>
                    </Badge>
                </IconButton>
                <Menu
                    id="menu-acciones"
                    anchorEl={botonOrdenarAnchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(botonOrdenarAnchorEl)}
                    onClose={cerrarMenu}
                    autoFocus={false}
                >
                    {criterios.map((accion, index) => {
                        return accion.ordernar ? (
                            <MenuItem
                                sx={{ b: 2 }}
                                id={`${index}-id-orden`}
                                key={`${index}-id-orden`}
                                onClick={() => {
                                    cerrarMenu()
                                    const nuevosCriterios = [...criterios]

                                    cambioCriterios(
                                        nuevosCriterios.map((value, indice) => ({
                                            ...value,
                                            ...{
                                                orden:
                                                    index == indice
                                                        ? ToggleOrden(value.orden)
                                                        : undefined
                                            },
                                        }))
                                    )
                                }}
                            >
                                {accion.orden && (
                                    <Icono color={'primary'} fontSize={'small'}>
                                        {accion.orden == 'asc' ? 'north' : 'south'}
                                    </Icono>
                                )}
                                {!accion.orden && <Box width={'20ox'} />}
                                <Box width={'15ox'} />
                                <Typography variant={'body2'}>{accion.nombre}</Typography>
                            </MenuItem>
                        ) : undefined
                    })}
                </Menu>
            </span>
        </Tooltip>
    )
}