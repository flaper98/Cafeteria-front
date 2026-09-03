import { MedioPago, Tone } from './common.model';

export type EstadoItemPedido = 'pendiente' | 'en-preparacion' | 'listo' | 'entregado';

export const ESTADOS_ITEM: Record<EstadoItemPedido, Tone> = {
  pendiente: { label: 'Pendiente', tone: 'neutral' },
  'en-preparacion': { label: 'En preparación', tone: 'warn' },
  listo: { label: 'Listo', tone: 'success' },
  entregado: { label: 'Entregado', tone: 'info' },
};

export type EstadoPedido = 'abierto' | 'en-cocina' | 'servido' | 'por-cobrar' | 'cerrado' | 'anulado';

export const ESTADOS_PEDIDO: Record<EstadoPedido, Tone> = {
  abierto: { label: 'Abierto', tone: 'neutral' },
  'en-cocina': { label: 'En cocina', tone: 'warn' },
  servido: { label: 'Servido', tone: 'info' },
  'por-cobrar': { label: 'Por cobrar', tone: 'brand' },
  cerrado: { label: 'Cerrado', tone: 'success' },
  anulado: { label: 'Anulado', tone: 'danger' },
};

export type CanalPedido = 'salon' | 'para-llevar' | 'delivery';

export const CANALES_PEDIDO: { value: CanalPedido; label: string }[] = [
  { value: 'salon', label: 'Salón' },
  { value: 'para-llevar', label: 'Para llevar' },
  { value: 'delivery', label: 'Delivery' },
];

export type Estacion = 'cocina' | 'parrilla' | 'barra' | 'postres';

export const ESTACIONES: { value: Estacion; label: string }[] = [
  { value: 'cocina', label: 'Cocina' },
  { value: 'parrilla', label: 'Parrilla' },
  { value: 'barra', label: 'Barra' },
  { value: 'postres', label: 'Postres' },
];

export interface ItemPedido {
  id: string;
  productoId: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  observacion?: string;
  estacion: Estacion;
  estado: EstadoItemPedido;
}

export interface Pedido {
  id: string;
  numero: string;
  mesaId?: string;
  numeroMesa?: number;
  canal: CanalPedido;
  mozoId: string;
  mozoNombre: string;
  clienteId?: string;
  clienteNombre?: string;
  items: ItemPedido[];
  estado: EstadoPedido;
  medioPago?: MedioPago;
  descuento: number;
  creadoEn: string;
  actualizadoEn: string;
}
