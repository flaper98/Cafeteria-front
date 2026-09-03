import { Injectable, computed } from '@angular/core';
import { PedidoDelivery } from '../models';
import { createEntityStore, generateId } from '../utils/entity-store';

function haceMinutos(min: number): string {
  return new Date(Date.now() - min * 60000).toISOString();
}

const SEED: PedidoDelivery[] = [
  { id: 'del-1', clienteNombre: 'Hugo Salazar', telefono: '987 654 321', direccion: 'Jr. Tarapacá 452', referencia: 'Frente a la plaza', costoEnvio: 5, repartidor: 'Kevin Flores', estado: 'en-camino', total: 41, creadoEn: haceMinutos(20) },
  { id: 'del-2', clienteNombre: 'Ana Bardales', telefono: '955 112 890', direccion: 'Av. Yarinacocha 1230', referencia: 'Edificio Los Ficus, dpto 302', costoEnvio: 6, estado: 'pendiente', total: 33, creadoEn: haceMinutos(8) },
  { id: 'del-3', clienteNombre: 'Manuel Ríos', telefono: '941 220 776', direccion: 'Jr. Progreso 815', costoEnvio: 5, repartidor: 'Kevin Flores', estado: 'entregado', total: 27, creadoEn: haceMinutos(70) },
  { id: 'del-4', clienteNombre: 'Cecilia Pérez', telefono: '926 553 410', direccion: 'Psje. Las Palmeras 220', referencia: 'Portón verde', costoEnvio: 6, estado: 'pendiente', total: 52, creadoEn: haceMinutos(3) },
];

@Injectable({ providedIn: 'root' })
export class DeliveryService {
  private store = createEntityStore<PedidoDelivery>(SEED);

  pedidos = computed(() => [...this.store.items()].sort((a, b) => (a.creadoEn < b.creadoEn ? 1 : -1)));
  enCurso = computed(() => this.pedidos().filter((p) => p.estado === 'pendiente' || p.estado === 'en-camino'));

  getById(id: string) {
    return this.store.getById(id);
  }

  crear(data: Omit<PedidoDelivery, 'id' | 'creadoEn'>) {
    this.store.add({ ...data, id: generateId('del'), creadoEn: new Date().toISOString() });
  }

  actualizar(id: string, changes: Partial<PedidoDelivery>) {
    this.store.update(id, changes);
  }

  eliminar(id: string) {
    this.store.remove(id);
  }
}
