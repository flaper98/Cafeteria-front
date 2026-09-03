import { Injectable, computed } from '@angular/core';
import { Reserva } from '../models';
import { createEntityStore, generateId } from '../utils/entity-store';

function fechaOffset(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

const SEED: Reserva[] = [
  { id: 'res-1', clienteNombre: 'Marco Tuesta', telefono: '961 223 344', fecha: fechaOffset(0), hora: '13:00', personas: 4, mesaId: 'mesa-6', numeroMesa: 6, estado: 'confirmada', observaciones: 'Cumpleaños, pedir torta con anticipación.' },
  { id: 'res-2', clienteNombre: 'Estefany Ríos', telefono: '944 556 112', fecha: fechaOffset(0), hora: '19:30', personas: 2, estado: 'pendiente' },
  { id: 'res-3', clienteNombre: 'Grupo Contadores SAC', telefono: '926 887 001', fecha: fechaOffset(1), hora: '12:30', personas: 8, estado: 'confirmada', observaciones: 'Reunión de trabajo, necesitan 2 mesas unidas.' },
  { id: 'res-4', clienteNombre: 'Sofía Vela', telefono: '987 112 233', fecha: fechaOffset(1), hora: '18:00', personas: 3, estado: 'pendiente' },
  { id: 'res-5', clienteNombre: 'Renzo Panduro', telefono: '955 331 209', fecha: fechaOffset(-1), hora: '20:00', personas: 2, estado: 'completada' },
  { id: 'res-6', clienteNombre: 'Familia Del Águila', telefono: '912 445 998', fecha: fechaOffset(2), hora: '13:30', personas: 5, estado: 'confirmada' },
  { id: 'res-7', clienteNombre: 'Diego Saavedra', telefono: '941 778 654', fecha: fechaOffset(-2), hora: '19:00', personas: 2, estado: 'cancelada', observaciones: 'Canceló por lluvia.' },
];

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private store = createEntityStore<Reserva>(SEED);

  reservas = this.store.items;
  deHoy = computed(() => this.reservas().filter((r) => r.fecha === fechaOffset(0)));
  proximas = computed(() =>
    this.reservas()
      .filter((r) => r.estado !== 'cancelada' && r.estado !== 'completada')
      .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora)),
  );

  getById(id: string) {
    return this.store.getById(id);
  }

  crear(data: Omit<Reserva, 'id'>) {
    this.store.add({ ...data, id: generateId('res') });
  }

  actualizar(id: string, changes: Partial<Reserva>) {
    this.store.update(id, changes);
  }

  eliminar(id: string) {
    this.store.remove(id);
  }
}
