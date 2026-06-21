/**
 * Aplica las reglas estrictas de consistencia operacional de HealthCore.
 */
export function validarReglasNegocioHealthCore(paciente, cita, reclamacion) {
    const errores = [];
    // Regla de Consistencia en Citas (No se puede facturar citas en No-Show o Cancelada)
    if ((cita.estado_cita === 'No-Show' || cita.estado_cita === 'Cancelada') && reclamacion.monto_bruto > 0) {
        errores.push("Regla Violada: No se permite transaccionar montos mayores a cero en citas con estado No-Show o Cancelada.");
    }
    // Regla de Bloqueo de Facturación de Alto Riesgo en US (Código CIE-10 mínimo 3 caracteres alfanuméricos si no fue revisado por IA)
    if (paciente.pais_residencia === 'US' && !reclamacion.validado_por_ia) {
        if (!reclamacion.codigo_cie10 || reclamacion.codigo_cie10.trim().length < 3) {
            errores.push("Regla Violada: Las reclamaciones de US sin validación de IA requieren un codigo_cie10 válido de mínimo 3 caracteres.");
        }
    }
    return {
        valido: errores.length === 0,
        errores
    };
}
