import {
    FormHelperText,
    IconButton,
    InputAdornment,
    InputBaseProps,
    InputLabel,
    OutlinedInputProps,
    InputProps as StandardInputProps,
    TextField
} from "@mui/material"
import { InputHTMLAttributes, useState } from "react";
import { Control, Controller, FieldPath, FieldValues, PathValue, RegisterOptions } from "react-hook-form";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { Icono } from "../Icono";

type Variant = TypographyProps['variant']

type FormInputTextProps<
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues>
> = {
    id: string
    name: TName
    control: Control<TFieldValues>
    label: string
    size?: 'small' | 'medium'
    type?: InputHTMLAttributes<unknown>['type']
    rules?: Omit<
        RegisterOptions<TFieldValues, TName>,
        'valuesAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
    >
    disabled?: boolean
    onChange?: StandardInputProps['onChange']
    InputProps?: Partial<OutlinedInputProps>
    inputProps?: InputBaseProps['inputProps']
    onEnter?: () => void
    clearable?: boolean
    variant?: 'standard' | 'outlined' | 'filled'
    rows?: number
    multiline?: boolean
    bgcolor?: string
    labelVariant?: Variant
}

export const FormInputText = <
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues>
>({
    id,
    name,
    control,
    label,
    size = 'small',
    type,
    rules,
    disabled,
    onChange,
    InputProps,
    inputProps,
    onEnter,
    clearable,
    variant,
    rows = 1,
    multiline = false,
    bgcolor,
    labelVariant = 'subtitle2'
}: FormInputTextProps<TFieldValues, TName>) => {

    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => setShowPassword(!showPassword)

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
                    <>
                        <TextField
                            id={id}
                            name={variant}
                            variant={variant}
                            sx={{
                                width: '100%',
                                bgcolor: bgcolor,
                            }}
                            size={size}
                            error={!!error}
                            rows={rows}
                            multiline={multiline}
                            type={showPassword ? 'text' : type}
                            onChange={(event) => {
                                if (onChange) {
                                    onChange(event)
                                }
                                field.onChange(event)
                            }}
                            inputRef={field.ref}
                            onKeyUp={(event) => {
                                if (event.key === 'Enter' && !event.shiftKey) {
                                    if (onEnter) {
                                        onEnter()
                                    }
                                }
                            }}
                            value={field.value}
                            disabled={disabled}
                            inputProps={inputProps}
                            InputProps={{
                                endAdornment:
                                    field.value && clearable ? (
                                        <IconButton
                                            size="small"
                                            color={'primary'}
                                            onClick={() => {
                                                field.onChange('')
                                            }}
                                        >
                                            <Icono color={'primary'}>clear</Icono>
                                        </IconButton>
                                    ) : type == 'password' ? (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowPassword}>
                                                {showPassword ? (
                                                    <Icono color={'inherit'}>visibility</Icono>
                                                ) : (
                                                    <Icono color={'inherit'}>visibility_off</Icono>
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ) : undefined,
                                ...InputProps,
                            }}
                        />
                        {!!error && <FormHelperText error>{error?.message}</FormHelperText>}
                    </>
                )}
                defaultValue={'' as PathValue<TFieldValues, TName>}
                rules={rules}
            />
        </div>
    )
}