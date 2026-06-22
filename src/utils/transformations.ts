import { Reclamaciones_Facturacion, ReporteFinancieroHealthCore } from '../types/models.js';

/**
 * Genera reportes financieros consolidados reduciendo la colección y abstrayendo outliers.
 */
export function generarReporteFinanciero(reclamaciones: Reclamaciones_Facturacion[]): ReporteFinancieroHealthCore {
    if (!reclamaciones || reclamaciones.length === 0) {
        return { total_facturado_usd: 0, total_facturado_gbp: 0, monto_maximo_reclamado: 0, tasa_rechazo_global: 0 };
    }

    let rechazadas = 0;
    let totalUSD = 0;
    let totalGBP = 0;
    let maximo = 0;

    reclamaciones.forEach(rec => {
        if (rec.moneda === 'USD') totalUSD += rec.monto_bruto;
        if (rec.moneda === 'GBP') totalGBP += rec.monto_bruto;
        if (rec.monto_bruto > maximo) maximo = rec.monto_bruto;
        if (rec.estado_factura === 'Rechazada') rechazadas++;
    });

    return {
        total_facturado_usd: Number(totalUSD.toFixed(2)),
        total_facturado_gbp: Number(totalGBP.toFixed(2)),
        monto_maximo_reclamado: Number(maximo.toFixed(2)),
        tasa_rechazo_global: Number(((rechazadas / reclamaciones.length) * 100).toFixed(2))
    };
}