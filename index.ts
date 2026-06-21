// ==========================================
// 1. DEFINICIÓN DE INTERFACES (EXACTO CONTEXT.md)
// ==========================================

export interface Pacientes {
    id_paciente: string; // UUID
    nombre: string;
    apellido: string;
    fecha_nacimiento: Date;
    genero_biologico: 'Masculino' | 'Femenino' | 'Intersex' | 'No especificado';
    email: string;
    telefono: string;
    pais_residencia: 'US' | 'GB';
    fecha_registro: Date;
}

export interface Clinicas {
    id_clinica: number;
    nombre_sede: string;
    pais: 'US' | 'GB';
    region_estado: string;
    sistema_ehr_origen: string;
}

export interface Citas_Medicas {
    id_cita: string; // UUID
    id_paciente: string; // FK
    id_clinica: number; // FK
    fecha_hora: Date; // Almacenada en UTC
    tipo_atencion: 'Primaria' | 'Especialista' | 'Cronico' | 'Preventivo';
    canal_reserva: 'Telefono' | 'Web' | 'App' | 'Presencial';
    estado_cita: 'Programada' | 'Completada' | 'No-Show' | 'Cancelada';
    score_riesgo_noshow: number; // Decimal (3,2) -> 0.00 a 1.00
}

export interface Encuentros_Clinicos {
    id_encuentro: string; // UUID
    id_cita: string; // FK
    notas_clinicas: string;
    tiempo_doc_minutos: number;
    asistido_por_ia: boolean;
}

export interface Reclamaciones_Facturacion {
    id_reclamacion: string; // UUID
    id_encuentro: string; // FK
    codigo_cie10: string;
    monto_bruto: number;
    moneda: 'USD' | 'GBP';
    tipo_pagador: 'Seguro_Comercial' | 'Medicare' | 'Medicaid' | 'Privado' | 'NHS';
    estado_factura: 'Pendiente_Revision' | 'Enviada' | 'Aprobada' | 'Rechazada';
    motivo_rechazo: string;
    validado_por_ia: boolean;
}

// ==========================================
// 2. FUNCIONES DE FILTRADO (MULTICRITERIO)
// ==========================================

export interface CriteriosFiltroCita {
    tipo_atencion?: 'Primaria' | 'Especialista' | 'Cronico' | 'Preventivo';
    estado_cita?: 'Programada' | 'Completada' | 'No-Show' | 'Cancelada';
    id_clinica?: number;
}

/**
 * Filtra un array de Citas_Medicas según los criterios especificados.
 */
export function filtrarCitas(citas: Citas_Medicas[], criterios: CriteriosFiltroCita): Citas_Medicas[] {
    return citas.filter(cita => {
        if (criterios.tipo_atencion && cita.tipo_atencion !== criterios.tipo_atencion) return false;
        if (criterios.estado_cita && cita.estado_cita !== criterios.estado_cita) return false;
        if (criterios.id_clinica && cita.id_clinica !== criterios.id_clinica) return false;
        return true;
    });
}

// ==========================================
// 3. FUNCIONES DE ORDENAMIENTO (ASC / DESC)
// ==========================================

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

// ==========================================
// 4. BÚSQUEDA LINEAL (ARRAYS DESORDENADOS)
// ==========================================

/**
 * Busca un paciente por su email exacto en un array desordenado.
 */
export function buscarPacientePorEmailLineal(pacientes: Pacientes[], emailBuscar: string): Pacientes | null {
    for (let i = 0; i < pacientes.length; i++) {
        if (pacientes[i].email.toLowerCase() === emailBuscar.toLowerCase()) {
            return pacientes[i];
        }
    }
    return null;
}

// ==========================================
// 5. BÚSQUEDA BINARIA (ARRAYS ORDENADOS)
// ==========================================

/**
 * Busca una clínica por su id_clinica en un array previamente ordenado de forma ascendente.
 */
export function buscarClinicaPorIdBinario(clinicasOrdenadas: Clinicas[], idBuscar: number): Clinicas | null {
    let izquierda = 0;
    let derecha = clinicasOrdenadas.length - 1;

    while (izquierda <= derecha) {
        const medio = Math.floor((izquierda + derecha) / 2);
        if (clinicasOrdenadas[medio].id_clinica === idBuscar) {
            return clinicasOrdenadas[medio];
        }
        if (clinicasOrdenadas[medio].id_clinica < idBuscar) {
            izquierda = medio + 1;
        } else {
            derecha = medio - 1;
        }
    }
    return null;
}

// ==========================================
// 6. FUNCIONES DE AGREGACIÓN (REPORTES)
// ==========================================

export interface ReporteFinancieroHealthCore {
    total_facturado_usd: number;
    total_facturado_gbp: number;
    monto_maximo_reclamado: number;
    tasa_rechazo_global: number;
}

/**
 * Genera métricas agregadas simulando el reporte financiero requerido por Tom Callahan.
 */
export function generarReporteFinanciero(reclamaciones: Reclamaciones_Facturacion[]): ReporteFinancieroHealthCore {
    let rechazadas = 0;
    let totalUSD = 0;
    let totalGBP = 0;
    let maximo = 0;

    if (reclamaciones.length === 0) {
        return { total_facturado_usd: 0, total_facturado_gbp: 0, monto_maximo_reclamado: 0, tasa_rechazo_global: 0 };
    }

    reclamaciones.forEach(rec => {
        if (rec.moneda === 'USD') totalUSD += rec.monto_bruto;
        if (rec.moneda === 'GBP') totalGBP += rec.monto_bruto;
        if (rec.monto_bruto > maximo) maximo = rec.monto_bruto;
        if (rec.estado_factura === 'Rechazada') rechazadas++;
    });

    return {
        total_facturado_usd: totalUSD,
        total_facturado_gbp: totalGBP,
        monto_maximo_reclamado: maximo,
        tasa_rechazo_global: (rechazadas / reclamaciones.length) * 100
    };
}

// ==========================================
// 7. VALIDACIONES DE NEGOCIO EXACTAS
// ==========================================

export interface ResultadoValidacion {
    valido: boolean;
    errores: string[];
}

/**
 * Aplica las reglas estrictas de consistencia operacional de HealthCore.
 */
export function validarReglasNegocioHealthCore(
    paciente: Pacientes, 
    cita: Citas_Medicas, 
    reclamacion: Reclamaciones_Facturacion
): ResultadoValidacion {
    const errores: string[] = [];

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

// ==========================================
// 8. DATA MOCK Y SCRIPT DE VERIFICACIÓN
// ==========================================

const mockPacientes: Pacientes[] = [
    { id_paciente: "p-101", nombre: "Jorge Andrés", apellido: "Padilla", fecha_nacimiento: new Date(1988, 5, 15), genero_biologico: "Masculino", email: "jorge@healthcore.com", telefono: "+50688888888", pais_residencia: "US", fecha_registro: new Date() }
];

const mockClinicas: Clinicas[] = [
    { id_clinica: 1, nombre_sede: "Austin Central", pais: "US", region_estado: "Texas", sistema_ehr_origen: "EHR_US_v2" },
    { id_clinica: 2, nombre_sede: "London City", pais: "GB", region_estado: "Greater London", sistema_ehr_origen: "EHR_UK_Manual" }
];

const mockCitas: Citas_Medicas[] = [
    { id_cita: "c-201", id_paciente: "p-101", id_clinica: 1, fecha_hora: new Date(), tipo_atencion: "Primaria", canal_reserva: "Web", estado_cita: "No-Show", score_riesgo_noshow: 0.92 }
];

const mockReclamaciones: Reclamaciones_Facturacion[] = [
    { id_reclamacion: "r-301", id_encuentro: "e-401", codigo_cie10: "M54.5", monto_bruto: 250.00, moneda: "USD", tipo_pagador: "Seguro_Comercial", estado_factura: "Rechazada", motivo_rechazo: "Falta firma de elegibilidad", validado_por_ia: false }
];

console.log("=== INICIANDO VALIDACIÓN DEL BACKEND HEALTHCORE ===");

// Ejecutar búsqueda lineal
const busquedaPac = buscarPacientePorEmailLineal(mockPacientes, "jorge@healthcore.com");
console.log("-> Búsqueda Lineal Paciente:", busquedaPac ? `${busquedaPac.nombre} ${busquedaPac.apellido}` : "No encontrado");

// Ejecutar búsqueda binaria
const busquedaCli = buscarClinicaPorIdBinario(mockClinicas, 1);
console.log("-> Búsqueda Binaria Clínica:", busquedaCli ? busquedaCli.nombre_sede : "No encontrada");

// Ejecutar reporte analítico
const reporteAnalitico = generarReporteFinanciero(mockReclamaciones);
console.log("-> Reporte de Agregación Financiera:", reporteAnalitico);

// Validar Reglas de Negocio Cruzadas
const evaluarReglas = validarReglasNegocioHealthCore(mockPacientes[0], mockCitas[0], mockReclamaciones[0]);
console.log("-> ¿Pasa las Reglas de Validación de Negocio?:", evaluarReglas.valido ? "SÍ" : "NO");
if (!evaluarReglas.valido) {
    console.log("⚠️ Alertas de Cumplimiento detectadas:", evaluarReglas.errores);
}