'use client'
import { useAuth } from "@/context/AuthProvider";
import { siteName, titleCase } from "@/utils/utilidades";
import { Box, Card, CardActionArea, CardContent, Chip, Grid, Icon, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { usuario, rolUsuario } = useAuth()
  console.log({ usuario });

  const router = useRouter()
  return (
    <>
      <title>{`Home - ${siteName()}`}</title>
      <Box>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid>
            <Typography
              variant={'h5'}
              component="h1"
              sx={{ flexGrow: 1, fontWeight: '600' }}
            >
              Bienvenido {titleCase(usuario?.persona?.nombres ?? '')}
            </Typography>
            <Chip
              label={rolUsuario?.nombre}
              variant={'outlined'}
              size={'small'}
            />
          </Grid>
        </Grid>
        <Grid>
          <Box height={'20px'}>
            <Typography sx={{ fontSize: 14 }}>
              Puedes ver los siguientes modulos
            </Typography>
            <Box height={'5px'} />
          </Box>
        </Grid>

        <Grid container direction="row" alignItems="center">
          <Grid container direction="row">
            {usuario?.roles
              .filter((ur) => ur.idRol == rolUsuario?.idRol)
              .map((rolUsuario, index) => (
                <div key={`usuario-${index}`}>
                  {rolUsuario.modulos.map((modulo, index1) => (
                    <Grid
                      container
                      direction="row"
                      key={`rolUsuario-${index}-${index1}`}
                    >
                      <Grid>
                        <Box height={'20px'} />
                        <Typography sx={{ fontSize: 14, fontWeight: '600' }}>
                          {modulo.label}
                        </Typography>
                        <Box height={'20px'} />
                      </Grid>
                      <Grid
                        container
                        direction="row"
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 2, sm: 8, md: 12, xl: 12 }}
                      >
                        {modulo.subModulo.map((subModulo, index2) => (
                          <Grid
                            key={`$subModulo-${index}-${index1}-${index2}`}
                          >
                            <CardActionArea
                              sx={{
                                borderRadius: 3
                              }}
                              onClick={() => {
                                router.push(subModulo.url)
                              }}
                            >
                              <Card
                                sx={{
                                  borderRadius: 3
                                }}
                              >
                                <CardContent>
                                  <Grid container direction="row">
                                    <Icon color={'primary'}>
                                      {subModulo.propiedades.icono}
                                    </Icon>
                                    <Box height={'30px'} width={'10px'} />
                                    <Typography
                                      variant="caption"
                                      sx={{ fontSize: 14, fontWeight: '600' }}
                                    >
                                      {`${subModulo.label}`}
                                    </Typography>
                                  </Grid>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontSize: 14 }}
                                  >
                                    {`${subModulo.propiedades.descripcion}`}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </CardActionArea>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  ))}
                </div>
              ))
            }
          </Grid>
        </Grid>
      </Box>
    </>
  )
}