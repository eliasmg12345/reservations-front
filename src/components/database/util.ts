import { CriterioOrdenType } from "./ordenType";

export const ordenFiltrado = (ordenCriterios: Array<CriterioOrdenType>) =>
    ordenCriterios
        .filter((value) => value.orden)
        .map((value) => (value.orden == 'asc' ? value.campo : `-${value.campo}`))