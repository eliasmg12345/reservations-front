
export interface RolCRUDType {
    id: string
    rol: string
}
export interface UsuarioRolCRUDType {
    fechaCreacion: Date
    usuarioCreacion: string
    fechaActulizacion: Date
    usuarioActualizacion?: string
    id: string
    estado: string
    rol: RolCRUDType
}

export interface PersonaCRUDType {
    nombres: string
    primerApellido: string
    segundoApellido: string
    tipoDocumento: string
    nroDocumento: string
    fechaNacimiento: string
}

export interface UsuarioCRUDType {
    id: string
    usuario: string
    ciudadaniaDigital: boolean
    correoElectronico: string
    estado: string
    usuarioRol: UsuarioRolCRUDType[]
    persona: PersonaCRUDType
}