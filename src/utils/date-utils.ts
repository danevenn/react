import { differenceInDays } from 'date-fns';

/**
 * Calcula la diferencia en días entre dos fechas de forma estricta.
 * @param fechaInicio - Fecha menor de inicio.
 * @param fechaFin - Fecha mayor que marca el final.
 * @returns {number} La cantidad de días de diferencia (tipo validado número).
 */
export function calcularDiferenciaDias(fechaInicio: Date, fechaFin: Date): number {
    // Como las firmas de entrada obligan a pasar objetos tipo Date, nos blindamos
    // frente a posibles inyecciones de strings u timestamps incorrectos.
    return differenceInDays(fechaFin, fechaInicio);
}
