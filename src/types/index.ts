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

export interface CriteriosFiltroCita {
    tipo_atencion?: 'Primaria' | 'Especialista' | 'Cronico' | 'Preventivo';
    estado_cita?: 'Programada' | 'Completada' | 'No-Show' | 'Cancelada';
    id_clinica?: number;
}

export interface ReporteFinancieroHealthCore {
    total_facturado_usd: number;
    total_facturado_gbp: number;
    monto_maximo_reclamado: number;
    tasa_rechazo_global: number;
}

export interface ResultadoValidacion {
    valido: boolean;
    errores: string[];
}