import { Citas_Medicas, CriteriosFiltroCita } from '../types/index.js';

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