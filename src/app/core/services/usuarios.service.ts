import { Injectable, computed } from '@angular/core';
import { Usuario } from '../models';
import { createEntityStore, generateId } from '../utils/entity-store';

export const USUARIOS_SEED: Usuario[] = [
  {
    id: 'usr-1',
    nombres: 'Flavio Pérez Haya',
    usuario: 'admin',
    password: '1234',
    rol: 'admin',
    activo: true,
    ultimoAcceso: '2026-09-02T08:15:00',
  },
  {
    id: 'usr-2',
    nombres: 'Rosa Vela Sánchez',
    usuario: 'cajero1',
    password: '1234',
    rol: 'cajero',
    activo: true,
    ultimoAcceso: '2026-09-02T08:02:00',
  },
  {
    id: 'usr-3',
    nombres: 'Jhon Ríos Tello',
    usuario: 'mozo1',
    password: '1234',
    rol: 'mozo',
    activo: true,
    ultimoAcceso: '2026-09-02T09:10:00',
  },
  {
    id: 'usr-4',
    nombres: 'Karen Mori Del Águila',
    usuario: 'mozo2',
    password: '1234',
    rol: 'mozo',
    activo: true,
    ultimoAcceso: '2026-09-01T20:41:00',
  },
  {
    id: 'usr-5',
    nombres: 'Luis Pinedo Ruiz',
    usuario: 'cocina1',
    password: '1234',
    rol: 'cocina',
    activo: true,
    ultimoAcceso: '2026-09-02T07:55:00',
  },
];

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private store = createEntityStore<Usuario>(USUARIOS_SEED);

  usuarios = this.store.items;
  activos = computed(() => this.usuarios().filter((u) => u.activo));

  getById(id: string) {
    return this.store.getById(id);
  }

  findByCredenciales(usuario: string, password: string): Usuario | undefined {
    return this.usuarios().find(
      (u) => u.usuario.toLowerCase() === usuario.trim().toLowerCase() && u.password === password && u.activo,
    );
  }

  crear(data: Omit<Usuario, 'id'>) {
    this.store.add({ ...data, id: generateId('usr') });
  }

  actualizar(id: string, changes: Partial<Usuario>) {
    this.store.update(id, changes);
  }

  eliminar(id: string) {
    this.store.remove(id);
  }

  registrarAcceso(id: string) {
    this.store.update(id, { ultimoAcceso: new Date().toISOString() });
  }
}
