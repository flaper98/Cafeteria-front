export interface Proveedor {
  id: string;
  nombre: string;
  contacto: string;
  telefono: string;
  ruc?: string;
  productos: string;
}

export interface ItemOrdenCompra {
  id: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
  precioUnitario: number;
}

import { Tone } from './common.model';

export type EstadoOrdenCompra = 'pendiente' | 'recibida' | 'anulada';

export const ESTADOS_ORDEN_COMPRA: Record<EstadoOrdenCompra, Tone> = {
  pendiente: { label: 'Pendiente', tone: 'warn' },
  recibida: { label: 'Recibida', tone: 'success' },
  anulada: { label: 'Anulada', tone: 'danger' },
};

export interface OrdenCompra {
  id: string;
  numero: string;
  proveedorId: string;
  proveedorNombre: string;
  fecha: string;
  items: ItemOrdenCompra[];
  estado: EstadoOrdenCompra;
}
