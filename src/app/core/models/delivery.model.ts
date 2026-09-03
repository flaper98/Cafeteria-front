import { Tone } from './common.model';

export type EstadoDelivery = 'pendiente' | 'en-camino' | 'entregado' | 'cancelado';

export const ESTADOS_DELIVERY: Record<EstadoDelivery, Tone> = {
  pendiente: { label: 'Pendiente', tone: 'neutral' },
  'en-camino': { label: 'En camino', tone: 'warn' },
  entregado: { label: 'Entregado', tone: 'success' },
  cancelado: { label: 'Cancelado', tone: 'danger' },
};

export interface PedidoDelivery {
  id: string;
  pedidoId?: string;
  clienteNombre: string;
  telefono: string;
  direccion: string;
  referencia?: string;
  costoEnvio: number;
  repartidor?: string;
  estado: EstadoDelivery;
  total: number;
  creadoEn: string;
}
