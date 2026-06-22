import { Pacientes, Clinicas } from '../types/models.js';

/**
 * Búsqueda Lineal secuencial para colecciones desordenadas.
 * Devuelve el objeto encontrado o null si no existe.
 */
export function buscarPacientePorEmailLineal(pacientes: Pacientes[], emailBuscar: string): Pacientes | null {
    if (!pacientes || pacientes.length === 0 || !emailBuscar) return null;
    
    const emailNormalizado = emailBuscar.toLowerCase().trim();
    for (let i = 0; i < pacientes.length; i++) {
        if (pacientes[i].email.toLowerCase().trim() === emailNormalizado) {
            return pacientes[i];
        }
    }
    return null;
}

/**
 * Búsqueda Binaria de alta velocidad sobre colecciones previamente ordenadas por ID.
 * Cumple con devolver el índice exacto o -1 si no se encuentra.
 */
export function buscarClinicaPorIdBinario(clinicasOrdenadas: Clinicas[], idBuscar: number): number {
    if (!clinicasOrdenadas || clinicasOrdenadas.length === 0) return -1;
    
    let izquierda = 0;
    let derecha = clinicasOrdenadas.length - 1;

    while (izquierda <= derecha) {
        const medio = Math.floor((izquierda + derecha) / 2);
        const idActual = clinicasOrdenadas[medio].id_clinica;

        if (idActual === idBuscar) {
            return medio;
        }
        if (idActual < idBuscar) {
            izquierda = medio + 1;
        } else {
            derecha = medio - 1;
        }
    }
    return -1;
}