import { Injectable, computed } from '@angular/core';
import { ItemOrdenCompra, OrdenCompra, Proveedor } from '../models';
import { createEntityStore, generateId } from '../utils/entity-store';

function haceDias(d: number): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - d);
  return fecha.toISOString().slice(0, 10);
}

const PROVEEDORES_SEED: Proveedor[] = [
  { id: 'prov-1', nombre: 'Norfagro Distribuciones', contacto: 'Elmer Chávez', telefono: '965 221 340', ruc: '20456781233', productos: 'Café en grano, azúcar, insumos secos' },
  { id: 'prov-2', nombre: 'Lácteos del Oriente EIRL', contacto: 'Milagros Sánchez', telefono: '941 887 220', ruc: '20512334455', productos: 'Leche, queso crema, insumos lácteos a granel' },
  { id: 'prov-3', nombre: 'AgroFresh Pucallpa', contacto: 'Julio Ramírez', telefono: '958 663 112', ruc: '20489912344', productos: 'Frutas y verduras frescas' },
  { id: 'prov-4', nombre: 'Descartables Amazonía', contacto: 'Rosa Panduro', telefono: '922 774 501', ruc: '20477621100', productos: 'Vasos, servilletas y empaques' },
  { id: 'prov-5', nombre: 'Panificadora Doña Meche', contacto: 'Mercedes Isuiza', telefono: '936 554 887', productos: 'Pan artesanal y bases de repostería' },
];

const ORDENES_SEED: OrdenCompra[] = [
  {
    id: 'oc-1',
    numero: 'OC-0041',
    proveedorId: 'prov-2',
    proveedorNombre: 'Lácteos del Oriente EIRL',
    fecha: haceDias(1),
    estado: 'recibida',
    items: [
      { id: generateId('it'), descripcion: 'Leche entera', cantidad: 40, unidad: 'L', precioUnitario: 4.0 },
      { id: generateId('it'), descripcion: 'Queso crema', cantidad: 8, unidad: 'kg', precioUnitario: 21 },
    ],
  },
  {
    id: 'oc-2',
    numero: 'OC-0042',
    proveedorId: 'prov-1',
    proveedorNombre: 'Norfagro Distribuciones',
    fecha: haceDias(0),
    estado: 'pendiente',
    items: [
      { id: generateId('it'), descripcion: 'Café en grano', cantidad: 10, unidad: 'kg', precioUnitario: 40 },
      { id: generateId('it'), descripcion: 'Azúcar blanca', cantidad: 15, unidad: 'kg', precioUnitario: 3.4 },
    ],
  },
  {
    id: 'oc-3',
    numero: 'OC-0043',
    proveedorId: 'prov-4',
    proveedorNombre: 'Descartables Amazonía',
    fecha: haceDias(0),
    estado: 'pendiente',
    items: [{ id: generateId('it'), descripcion: 'Vasos descartables 12oz', cantidad: 500, unidad: 'unid', precioUnitario: 0.26 }],
  },
  {
    id: 'oc-4',
    numero: 'OC-0040',
    proveedorId: 'prov-3',
    proveedorNombre: 'AgroFresh Pucallpa',
    fecha: haceDias(3),
    estado: 'recibida',
    items: [
      { id: generateId('it'), descripcion: 'Palta', cantidad: 10, unidad: 'kg', precioUnitario: 6.5 },
      { id: generateId('it'), descripcion: 'Fresa', cantidad: 8, unidad: 'kg', precioUnitario: 9 },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class ComprasService {
  private proveedorStore = createEntityStore<Proveedor>(PROVEEDORES_SEED);
  private ordenStore = createEntityStore<OrdenCompra>(ORDENES_SEED);

  proveedores = this.proveedorStore.items;
  ordenes = computed(() => [...this.ordenStore.items()].sort((a, b) => (a.fecha < b.fecha ? 1 : -1)));
  pendientes = computed(() => this.ordenes().filter((o) => o.estado === 'pendiente'));

  totalOrden(orden: OrdenCompra): number {
    return orden.items.reduce((acc, it) => acc + it.cantidad * it.precioUnitario, 0);
  }

  crearProveedor(data: Omit<Proveedor, 'id'>) {
    this.proveedorStore.add({ ...data, id: generateId('prov') });
  }

  actualizarProveedor(id: string, changes: Partial<Proveedor>) {
    this.proveedorStore.update(id, changes);
  }

  eliminarProveedor(id: string) {
    this.proveedorStore.remove(id);
  }

  crearOrden(proveedorId: string, items: Omit<ItemOrdenCompra, 'id'>[]) {
    const proveedor = this.proveedorStore.getById(proveedorId);
    if (!proveedor) return;
    const numero = `OC-${(this.ordenStore.items().length + 41).toString().padStart(4, '0')}`;
    this.ordenStore.add({
      id: generateId('oc'),
      numero,
      proveedorId,
      proveedorNombre: proveedor.nombre,
      fecha: new Date().toISOString().slice(0, 10),
      estado: 'pendiente',
      items: items.map((it) => ({ ...it, id: generateId('it') })),
    });
  }

  marcarRecibida(id: string) {
    this.ordenStore.update(id, { estado: 'recibida' });
  }

  anularOrden(id: string) {
    this.ordenStore.update(id, { estado: 'anulada' });
  }
}
