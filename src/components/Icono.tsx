import { Icon, IconPropsColorOverrides, IconPropsSizeOverrides, SxProps, Theme } from "@mui/material";
import { CSSProperties, FC, PropsWithChildren } from "react";
import { OverridableStringUnion } from "@mui/types";

interface Props {
    color?: OverridableStringUnion<
        | 'inherit'
        | 'action'
        | 'disabled'
        | 'primary'
        | 'secondary'
        | 'error'
        | 'info'
        | 'success'
        | 'warning',
        IconPropsColorOverrides
    >
    fontSize?: OverridableStringUnion<
        'inherit' | 'large' | 'medium' | 'small',
        IconPropsSizeOverrides
    >
    sx?: SxProps<Theme>
    style?: CSSProperties
}

export const Icono: FC<PropsWithChildren<Props>> = ({
    color,
    fontSize,
    children,
    sx,
    style
}) => {
    return (
        <Icon
            sx={{ ...sx }}
            style={{ ...style }}
            fontSize={fontSize}
            color={color}
            className={'material-icons-outlined'}
        >
            {children}
        </Icon>
    )
}