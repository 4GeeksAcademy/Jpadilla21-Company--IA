import { Pacientes, Citas_Medicas, Reclamaciones_Facturacion, ResultadoValidacion } from '../types/models.js';

/**
 * Valida la consistencia de datos operacionales bloqueando registros corruptos.
 */
export function validarReglasNegocioHealthCore(
    paciente: Pacientes, 
    cita: Citas_Medicas, 
    reclamacion: Reclamaciones_Facturacion
): ResultadoValidacion {
    const errores: string[] = [];

    // Consistencia Operacional bs Facturación
    if ((cita.estado_cita === 'No-Show' || cita.estado_cita === 'Cancelada') && reclamacion.monto_bruto > 0) {
        errores.push("Regla Violada: No se permite transaccionar montos mayores a cero en citas con estado No-Show o Cancelada.");
    }

    // Regla de Protección Regulatoria de Mercado US sin validación de IA
    if (paciente.pais_residencia === 'US' && !reclamacion.validated_por_ia) {
        if (!reclamacion.codigo_cie10 || reclamacion.codigo_cie10.trim().length < 3) {
            errores.push("Regla Violada: Las reclamaciones de US sin validación de IA requieren un codigo_cie10 de mínimo 3 caracteres.");
        }
    }

    return {
        valido: errores.length === 0,
        errores
    };
}