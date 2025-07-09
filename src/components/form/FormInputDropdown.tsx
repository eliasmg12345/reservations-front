import {
    Box,
    Checkbox,
    Chip,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    InputProps as StandardInputProps,
} from "@mui/material"
import { useState } from "react";
import { Control, Controller, FieldPath, FieldValues, PathValue, RegisterOptions } from "react-hook-form";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { Icono } from "../Icono";

type Variant = TypographyProps['variant']

export interface optionType {
    key: string
    value: string
    label: string
}

type FormInputDropdownProps<
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues>,
> = {
    id: string
    name: TName
    control: Control<TFieldValues>
    label: string
    size?: 'small' | 'medium'
    rules?: Omit<
        RegisterOptions<TFieldValues, TName>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
    >
    disabled?: boolean
    onChange?: (event: SelectChangeEvent<string[]>) => void
    clearable?: boolean
    bgcolor?: string
    options: optionType[]
    labelVariant?: Variant
}

export const FormInputDropdown = <
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues>
>({
    id,
    name,
    control,
    label,
    size = 'small',
    rules,
    disabled,
    onChange,
    clearable,
    bgcolor,
    options,
    labelVariant = 'subtitle2'
}: FormInputDropdownProps<TFieldValues, TName>) => {

    const generateSelectOptions = () =>
        options.map((option) => (
            <MenuItem key={option.key} value={option.value}>
                {option.label}
            </MenuItem>
        ))
    return (
        <div>
            <InputLabel htmlFor={id}>
                <Typography
                    variant={labelVariant}
                    sx={{ pb: 1, color: 'text.primary', fontWeight: '500' }}
                >
                    {label}
                </Typography>
            </InputLabel>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <>
                        <Select
                            id={id}
                            name={name}
                            sx={{
                                width: '100%',
                                bgcolor: bgcolor,
                                '& .MuiSelect-iconOutlined': {
                                    display: field.value && clearable ? 'none' : '',
                                },
                                '&.Mui-focused .MuiIconButton-root': { color: 'primary.main' },
                            }}
                            size={size}
                            error={!!error}
                            disabled={disabled}
                            onChange={(event) => {
                                if (onChange) {
                                    onChange(event)
                                }
                                field.onChange(event)
                            }}
                            inputRef={field.ref}
                            value={field.value}
                            endAdornment={
                                field.value && clearable ? (
                                    <IconButton
                                        sx={{ display: field.value ? '' : 'none' }}
                                        onClick={() => {
                                            field.onChange('')
                                        }}
                                        color={'primary'}
                                    >
                                        <Icono color={'primary'}>clear</Icono>
                                    </IconButton>
                                ) : undefined
                            }
                        >
                            {generateSelectOptions()}
                        </Select>
                        {!!error && <FormHelperText error>{error?.message}</FormHelperText>}
                    </>
                )}
                defaultValue={[] as PathValue<TFieldValues, TName>}
                rules={rules}
            />
        </div>
    )
}