import { Pacientes, Clinicas } from '../types/index.js';

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