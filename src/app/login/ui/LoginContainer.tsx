import { useAuth } from "@/context/AuthProvider"
import { Box, Button, Card, Typography } from "@mui/material"
import { useForm } from "react-hook-form"
import { LoginType } from "../types/loginTypes"
import { FormInputText } from "@/components/form/FormInputText"
import ProgresoLineal from "@/components/progreso/ProgresoLineal"


const LoginContainer = () => {

    const { ingresar, progresoLogin } = useAuth()

    const { handleSubmit, control } = useForm<LoginType>({
        defaultValues: {},
    })

    const iniciarSesion = async ({ usuario, contrasena }: LoginType) => {
        await ingresar({ usuario, contrasena })
    }

    return (
        <Card
            sx={{
                borderRadius: 4,
                p: 3,
                px: 4
            }}
        >
            <form onSubmit={handleSubmit(iniciarSesion)}>
                <Box
                    display={'grid'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    sx={{ borderRadius: 12 }}
                >
                    <Typography align={'center'} sx={{ fontWeight: '600' }}>
                        Inicio de Sesión
                    </Typography>
                    <Box sx={{ my: 2 }}>
                        <Typography
                            fontSize={14}
                            variant={'body1'}
                            color={'textSecondary'}
                        >
                            Ingresa tus credenciales para iniciar sesión
                        </Typography>
                    </Box>
                    <FormInputText
                        id={'usuario'}
                        control={control}
                        name="usuario"
                        label="Usuario"
                        size={'medium'}
                        labelVariant={'subtitle1'}
                        disabled={progresoLogin}
                        rules={{ required: 'Este campo es requerido' }}
                    />
                    <Box sx={{ my: 1 }}></Box>
                    <FormInputText
                        id={'contrasena'}
                        control={control}
                        name="contrasena"
                        label="Contraseña"
                        size={'medium'}
                        labelVariant={'subtitle1'}
                        type={'password'}
                        disabled={progresoLogin}
                        rules={{
                            required: 'Este campo es requerido',
                            minLength: {
                                value: 3,
                                message: 'Minimo 3 caracteres'
                            }
                        }}
                    />
                    <Box sx={{ my: 0.5 }}>
                        <ProgresoLineal mostrar={progresoLogin} />
                    </Box>
                    <Box display="flex" flex="1" justifyContent="start">
                        Do: Olvidaste tu constraseña
                    </Box>
                    <Box sx={{ height: 15 }}></Box>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={progresoLogin}
                    >
                        <Typography sx={{ fontWeight: '600' }}>Iniciar Sesión</Typography>
                    </Button>
                </Box>
            </form>
        </Card>
    )
}

export default LoginContainer