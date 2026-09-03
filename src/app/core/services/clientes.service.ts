import { Injectable, computed } from '@angular/core';
import { Cliente } from '../models';
import { createEntityStore, generateId } from '../utils/entity-store';

function haceDias(d: number): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - d);
  return fecha.toISOString().slice(0, 10);
}

const SEED: Cliente[] = [
  { id: 'cli-1', nombres: 'Marco Tuesta', telefono: '961 223 344', email: 'marco.tuesta@mail.com', visitas: 14, consumoTotal: 682, ultimaVisita: haceDias(0), preferencias: 'Cappuccino, sin azúcar' },
  { id: 'cli-2', nombres: 'Estefany Ríos', telefono: '944 556 112', visitas: 6, consumoTotal: 210, ultimaVisita: haceDias(2) },
  { id: 'cli-3', nombres: 'Sofía Vela', telefono: '987 112 233', email: 'sofia.vela@mail.com', visitas: 3, consumoTotal: 95, ultimaVisita: haceDias(6) },
  { id: 'cli-4', nombres: 'Renzo Panduro', telefono: '955 331 209', visitas: 21, consumoTotal: 1180, ultimaVisita: haceDias(1), preferencias: 'Combo Desayuno Tirol' },
  { id: 'cli-5', nombres: 'Familia Del Águila', telefono: '912 445 998', visitas: 9, consumoTotal: 540, ultimaVisita: haceDias(3) },
  { id: 'cli-6', nombres: 'Diego Saavedra', telefono: '941 778 654', visitas: 2, consumoTotal: 58, ultimaVisita: haceDias(10) },
];

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private store = createEntityStore<Cliente>(SEED);

  clientes = computed(() => [...this.store.items()].sort((a, b) => b.consumoTotal - a.consumoTotal));

  getById(id: string) {
    return this.store.getById(id);
  }

  crear(data: Omit<Cliente, 'id'>) {
    this.store.add({ ...data, id: generateId('cli') });
  }

  actualizar(id: string, changes: Partial<Cliente>) {
    this.store.update(id, changes);
  }

  eliminar(id: string) {
    this.store.remove(id);
  }
}
