import { Citas_Medicas, CriteriosFiltroCita, Reclamaciones_Facturacion } from '../types/models.js';

/**
 * Filtra colecciones de citas médicas según múltiples criterios opcionales.
 * Maneja de forma segura casos de arreglos vacíos.
 */
export function filtrarCitas(citas: Citas_Medicas[], criterios: CriteriosFiltroCita): Citas_Medicas[] {
    if (!citas || citas.length === 0) return [];
    
    return citas.filter(cita => {
        if (criterios.tipo_atencion && cita.tipo_atencion !== criterios.tipo_atencion) return false;
        if (criterios.estado_cita && cita.estado_cita !== criterios.estado_cita) return false;
        if (criterios.id_clinica && cita.id_clinica !== criterios.id_clinica) return false;
        return true;
    });
}

/**
 * Ordena reclamaciones por monto bruto sin mutar el arreglo original (Inmutabilidad).
 */
export function ordenarReclamacionesPorMonto(
    reclamaciones: Reclamaciones_Facturacion[], 
    orden: 'asc' | 'desc'
): Reclamaciones_Facturacion[] {
    if (!reclamaciones || reclamaciones.length === 0) return [];
    
    return [...reclamaciones].sort((a, b) => {
        return orden === 'asc' ? a.monto_bruto - b.monto_bruto : b.monto_bruto - a.monto_bruto;
    });
}