import { Reclamaciones_Facturacion } from '../types/index.js';

/**
 * Ordena las reclamaciones de facturación según el monto_bruto de forma ascendente o descendente.
 */
export function ordenarReclamacionesPorMonto(
    reclamaciones: Reclamaciones_Facturacion[], 
    orden: 'asc' | 'desc'
): Reclamaciones_Facturacion[] {
    return [...reclamaciones].sort((a, b) => {
        return orden === 'asc' ? a.monto_bruto - b.monto_bruto : b.monto_bruto - a.monto_bruto;
    });
}