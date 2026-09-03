import { Injectable, computed } from '@angular/core';
import { MedioPago, MovimientoCaja, TurnoCaja } from '../models';
import { createEntityStore, generateId } from '../utils/entity-store';

function hoyA(hora: number, minuto: number): string {
  const d = new Date();
  d.setHours(hora, minuto, 0, 0);
  return d.toISOString();
}

function ayerA(hora: number, minuto: number): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(hora, minuto, 0, 0);
  return d.toISOString();
}

const TURNOS_SEED: TurnoCaja[] = [
  {
    id: 'turno-1',
    cajeroId: 'usr-2',
    cajeroNombre: 'Rosa Vela',
    montoApertura: 200,
    aperturaEn: hoyA(7, 30),
    estado: 'abierto',
  },
  {
    id: 'turno-0',
    cajeroId: 'usr-2',
    cajeroNombre: 'Rosa Vela',
    montoApertura: 150,
    aperturaEn: ayerA(7, 20),
    cierreEn: ayerA(21, 10),
    montoCierreContado: 812,
    estado: 'cerrado',
  },
];

const MOVIMIENTOS_SEED: MovimientoCaja[] = [
  { id: 'mov-1', turnoId: 'turno-1', tipo: 'venta', concepto: 'Mesa 3 · Comanda C-0230', monto: 44, medioPago: 'efectivo', hora: hoyA(9, 5) },
  { id: 'mov-2', turnoId: 'turno-1', tipo: 'venta', concepto: 'Para llevar · Comanda C-0221', monto: 19, medioPago: 'yape', hora: hoyA(9, 20) },
  { id: 'mov-3', turnoId: 'turno-1', tipo: 'egreso', concepto: 'Compra de vasos descartables', monto: 35, hora: hoyA(10, 0) },
  { id: 'mov-4', turnoId: 'turno-1', tipo: 'venta', concepto: 'Mesa 8 · Comanda C-0215', monto: 58, medioPago: 'tarjeta', hora: hoyA(10, 40) },
  { id: 'mov-5', turnoId: 'turno-1', tipo: 'ingreso', concepto: 'Fondo adicional autorizado por administración', monto: 100, hora: hoyA(11, 15) },
  { id: 'mov-6', turnoId: 'turno-1', tipo: 'venta', concepto: 'Mesa 1 · Comanda C-0207', monto: 27, medioPago: 'plin', hora: hoyA(12, 5) },
  { id: 'mov-7', turnoId: 'turno-1', tipo: 'venta', concepto: 'Delivery · Comanda C-0198', monto: 36, medioPago: 'efectivo', hora: hoyA(12, 40) },
  { id: 'mov-8', turnoId: 'turno-1', tipo: 'egreso', concepto: 'Propina compartida turno mañana', monto: 20, hora: hoyA(13, 10) },
];

@Injectable({ providedIn: 'root' })
export class CajaService {
  private turnoStore = createEntityStore<TurnoCaja>(TURNOS_SEED);
  private movimientoStore = createEntityStore<MovimientoCaja>(MOVIMIENTOS_SEED);

  turnos = this.turnoStore.items;
  movimientos = this.movimientoStore.items;

  turnoAbierto = computed(() => this.turnos().find((t) => t.estado === 'abierto'));

  movimientosDe(turnoId: string) {
    return computed(() =>
      this.movimientos()
        .filter((m) => m.turnoId === turnoId)
        .sort((a, b) => (a.hora < b.hora ? 1 : -1)),
    );
  }

  resumenTurno(turno: TurnoCaja) {
    const movimientos = this.movimientos().filter((m) => m.turnoId === turno.id);
    const ventas = movimientos.filter((m) => m.tipo === 'venta');
    const ingresos = movimientos.filter((m) => m.tipo === 'ingreso').reduce((a, m) => a + m.monto, 0);
    const egresos = movimientos.filter((m) => m.tipo === 'egreso').reduce((a, m) => a + m.monto, 0);
    const ventasPorMedio: Record<MedioPago, number> = { efectivo: 0, yape: 0, plin: 0, tarjeta: 0 };
    for (const v of ventas) {
      if (v.medioPago) ventasPorMedio[v.medioPago] += v.monto;
    }
    const totalVentas = ventas.reduce((a, m) => a + m.monto, 0);
    const esperadoEfectivo = turno.montoApertura + ventasPorMedio.efectivo + ingresos - egresos;
    return { ventas, totalVentas, ventasPorMedio, ingresos, egresos, esperadoEfectivo };
  }

  abrirTurno(cajeroId: string, cajeroNombre: string, montoApertura: number) {
    const turno: TurnoCaja = {
      id: generateId('turno'),
      cajeroId,
      cajeroNombre,
      montoApertura,
      aperturaEn: new Date().toISOString(),
      estado: 'abierto',
    };
    this.turnoStore.add(turno);
    return turno;
  }

  registrarMovimiento(data: Omit<MovimientoCaja, 'id' | 'hora'>) {
    this.movimientoStore.add({ ...data, id: generateId('mov'), hora: new Date().toISOString() });
  }

  cerrarTurno(turnoId: string, montoContado: number) {
    this.turnoStore.update(turnoId, {
      estado: 'cerrado',
      cierreEn: new Date().toISOString(),
      montoCierreContado: montoContado,
    });
  }
}
