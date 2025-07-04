import { FormHelperText, IconButton, InputLabel, TextField, Typography, TypographyProps } from "@mui/material"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from "dayjs"
import "dayjs/locale/es-mx"
import { Control, Controller, FieldPath, FieldValues, PathValue, RegisterOptions } from "react-hook-form"
import { DatePicker } from "@mui/x-date-pickers"
import { Icono } from "../Icono"
import { validarFechaFormato } from "@/utils/fechas"

type Variant = TypographyProps['variant']


type FormDatePickerProps<
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues>,
> = {
    id: string
    name: TName
    control: Control<TFieldValues>
    label: string
    size?: 'small' | 'medium'
    format?: string
    disabled?: boolean
    rules?: Omit<
        RegisterOptions<TFieldValues, TName>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAS' | 'disabled'
    >
    bgcolor?: string
    minDate?: Dayjs
    maxDate?: Dayjs
    labelVariant?: Variant
    desktopModelMediaQuery?: string
    clearable?: boolean
}

export const FormInputDate = <
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues>,
>({
    id,
    name,
    control,
    label,
    size = 'small',
    format = 'DD/MM/YYYY',
    disabled,
    rules,
    bgcolor,
    minDate,
    maxDate,
    labelVariant = 'subtitle2',
    desktopModelMediaQuery = '',
    clearable,

}: FormDatePickerProps<TFieldValues, TName>) => {
    return (
        <div>
            <InputLabel htmlFor={id}>
                <Typography
                    variant={labelVariant}
                    sx={{ color: 'text.primary', fontWeight: '500' }}
                >
                    {label}
                </Typography>
            </InputLabel>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
                        <DatePicker
                            onChange={field.onChange}
                            value={field.value ? dayjs(field.value) : null}
                            format={format}
                            minDate={minDate}
                            maxDate={maxDate}
                            disabled={disabled}
                            desktopModeMediaQuery={desktopModelMediaQuery}
                            slotProps={{
                                textField: {
                                    id,
                                    name,
                                    size,
                                    inputRef: field.ref,
                                    sx: { width: '100%', bgcolor },
                                    error: !!error,
                                    helperText: error?.message,
                                    InputProps: {
                                        endAdornment:
                                            field.value && clearable ? (
                                                <IconButton
                                                    sx={{ marginRight: '-12px' }}
                                                    color="primary"
                                                    onClick={() => field.onChange(null)}
                                                >
                                                    <Icono color="primary">clear</Icono>
                                                </IconButton>
                                            ) : undefined
                                    }
                                }
                            }}
                        />
                        {!!error && (
                            <FormHelperText error>{error?.message}</FormHelperText>
                        )}
                    </LocalizationProvider>
                )}
                rules={{

                    ...{
                        validate: (val?: string) => {
                            if (val && !validarFechaFormato(val, format)) {
                                return 'La fecha no es válida'
                            }
                        },
                    },
                    ...rules,
                    
                    // validate: (val) => {
                    //     const date = typeof val === 'string' ? dayjs(val) : val;
                    //     if (date && !date.isValid()) {
                    //         return 'La fecha no es válida';
                    //     }
                    //     return true;
                    // },
                    // ...rules,
                }}
                defaultValue={null as PathValue<TFieldValues, TName>}
            />
        </div>
    )
}