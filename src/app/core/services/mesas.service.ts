import { Injectable, computed } from '@angular/core';
import { Mesa, EstadoMesa } from '../models';
import { createEntityStore, generateId } from '../utils/entity-store';

const HOY = new Date();
function haceMinutos(min: number) {
  return new Date(HOY.getTime() - min * 60000).toISOString();
}

export const MESAS_SEED: Mesa[] = [
  { id: 'mesa-1', numero: 1, zona: 'Salón Principal', capacidad: 4, estado: 'ocupada', mozoId: 'usr-3', mozoNombre: 'Jhon Ríos', horaOcupacion: haceMinutos(18), pedidoId: 'ped-1' },
  { id: 'mesa-2', numero: 2, zona: 'Salón Principal', capacidad: 2, estado: 'libre' },
  { id: 'mesa-3', numero: 3, zona: 'Salón Principal', capacidad: 4, estado: 'por-cobrar', mozoId: 'usr-4', mozoNombre: 'Karen Mori', horaOcupacion: haceMinutos(42), pedidoId: 'ped-2' },
  { id: 'mesa-4', numero: 4, zona: 'Salón Principal', capacidad: 6, estado: 'libre' },
  { id: 'mesa-5', numero: 5, zona: 'Salón Principal', capacidad: 4, estado: 'ocupada', mozoId: 'usr-3', mozoNombre: 'Jhon Ríos', horaOcupacion: haceMinutos(9), pedidoId: 'ped-3' },
  { id: 'mesa-6', numero: 6, zona: 'Salón Principal', capacidad: 2, estado: 'reservada' },
  { id: 'mesa-7', numero: 7, zona: 'Terraza', capacidad: 4, estado: 'libre' },
  { id: 'mesa-8', numero: 8, zona: 'Terraza', capacidad: 4, estado: 'ocupada', mozoId: 'usr-4', mozoNombre: 'Karen Mori', horaOcupacion: haceMinutos(25), pedidoId: 'ped-4' },
  { id: 'mesa-9', numero: 9, zona: 'Terraza', capacidad: 2, estado: 'libre' },
  { id: 'mesa-10', numero: 10, zona: 'Terraza', capacidad: 6, estado: 'libre' },
  { id: 'mesa-11', numero: 11, zona: 'Barra', capacidad: 2, estado: 'libre' },
  { id: 'mesa-12', numero: 12, zona: 'Barra', capacidad: 2, estado: 'libre' },
];

@Injectable({ providedIn: 'root' })
export class MesasService {
  private store = createEntityStore<Mesa>(MESAS_SEED);

  mesas = this.store.items;
  zonas = computed(() => Array.from(new Set(this.mesas().map((m) => m.zona))));
  libres = computed(() => this.mesas().filter((m) => m.estado === 'libre'));
  ocupadas = computed(() => this.mesas().filter((m) => m.estado === 'ocupada'));

  getById(id: string) {
    return this.store.getById(id);
  }

  mesasPorZona(zona: string) {
    return computed(() => this.mesas().filter((m) => m.zona === zona));
  }

  cambiarEstado(id: string, estado: EstadoMesa) {
    this.store.update(id, { estado });
  }

  ocupar(id: string, mozoId: string, mozoNombre: string, pedidoId: string) {
    this.store.update(id, {
      estado: 'ocupada',
      mozoId,
      mozoNombre,
      pedidoId,
      horaOcupacion: new Date().toISOString(),
    });
  }

  liberar(id: string) {
    this.store.update(id, {
      estado: 'libre',
      mozoId: undefined,
      mozoNombre: undefined,
      pedidoId: undefined,
      horaOcupacion: undefined,
    });
  }

  marcarPorCobrar(id: string) {
    this.store.update(id, { estado: 'por-cobrar' });
  }

  crear(data: Omit<Mesa, 'id'>) {
    this.store.add({ ...data, id: generateId('mesa') });
  }

  actualizar(id: string, changes: Partial<Mesa>) {
    this.store.update(id, changes);
  }

  eliminar(id: string) {
    this.store.remove(id);
  }
}
