import { PoliticaType } from "@/app/login/types/loginTypes"
import { basicModel, basicPolicy } from "@/utils/casbin"
import { imprimir } from "@/utils/imprimir"
import { Enforcer } from "casbin"

interface InterpretarPermisoParams {
    routerName: string
    enforcer?: Enforcer
    rol?: string
}

interface permisoSobreAccionParams {
    enforcer?: Enforcer
    rol: string
    objeto: string
    accion: string
}
export const useCasbinEnforcer = () => {
    interface VerificarAutotizacionType {
        enforcer?: Enforcer
        politica?: PoliticaType
    }

    const inicializarCasbin = async (politicas: string[]) => {
        const casbinLib = await import('casbin')
        imprimir('casbinLib', casbinLib)

        const model = casbinLib.newModelFromString(basicModel)
        const policy = new casbinLib.StringAdapter(basicPolicy)
        const enforcerTemp: Enforcer = await casbinLib.newEnforcer(model, policy)
        for await (const p of politicas) {
            await enforcerTemp.addPolicy(p[0], p[1], p[2], p[3], p[4], p[5])
        }
        return enforcerTemp
    }

    const verificarAutorizacion = async ({
        enforcer,
        politica
    }: VerificarAutotizacionType): Promise<boolean> => {
        return (
            (await enforcer?.enforce(
                politica?.sujeto,
                politica?.objeto,
                politica?.accion
            )) ?? false
        )
    }

    const permisoSobreAccion = ({
        enforcer,
        rol,
        objeto,
        accion,
    }: permisoSobreAccionParams) => {
        return verificarAutorizacion({
            enforcer,
            politica: {
                sujeto: rol,
                objeto: objeto,
                accion: accion,
            }
        })
    }

    const interpretarPermiso = async ({
        routerName,
        enforcer,
        rol,
    }: InterpretarPermisoParams) => {
        return {
            read: await verificarAutorizacion({
                enforcer: enforcer,
                politica: {
                    sujeto: rol ?? '',
                    objeto: routerName,
                    accion: 'read',
                }
            }),
            create: await verificarAutorizacion({
                enforcer: enforcer,
                politica: {
                    sujeto: rol ?? '',
                    objeto: routerName,
                    accion: 'create',
                },
            }),
            update: await verificarAutorizacion({
                enforcer: enforcer,
                politica: {
                    sujeto: rol ?? '',
                    objeto: routerName,
                    accion: 'update',
                },
            }),
            delete: await verificarAutorizacion({
                enforcer: enforcer,
                politica: {
                    sujeto: rol ?? '',
                    objeto: routerName,
                    accion: 'delete',
                },
            }),
        }
    }

    return { inicializarCasbin, interpretarPermiso, permisoSobreAccion }
}