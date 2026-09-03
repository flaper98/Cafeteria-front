import { Tone } from './common.model';

export type EstadoReserva = 'confirmada' | 'pendiente' | 'cancelada' | 'completada';

export const ESTADOS_RESERVA: Record<EstadoReserva, Tone> = {
  confirmada: { label: 'Confirmada', tone: 'success' },
  pendiente: { label: 'Pendiente', tone: 'warn' },
  cancelada: { label: 'Cancelada', tone: 'danger' },
  completada: { label: 'Completada', tone: 'info' },
};

export interface Reserva {
  id: string;
  clienteNombre: string;
  telefono: string;
  fecha: string;
  hora: string;
  personas: number;
  mesaId?: string;
  numeroMesa?: number;
  estado: EstadoReserva;
  observaciones?: string;
}
