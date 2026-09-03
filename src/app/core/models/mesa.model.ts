import { Tone } from './common.model';

export type EstadoMesa = 'libre' | 'ocupada' | 'por-cobrar' | 'reservada';

export const ESTADOS_MESA: Record<EstadoMesa, Tone> = {
  libre: { label: 'Libre', tone: 'success' },
  ocupada: { label: 'Ocupada', tone: 'warn' },
  'por-cobrar': { label: 'Por cobrar', tone: 'info' },
  reservada: { label: 'Reservada', tone: 'brand' },
};

export interface Mesa {
  id: string;
  numero: number;
  zona: string;
  capacidad: number;
  estado: EstadoMesa;
  mozoId?: string;
  mozoNombre?: string;
  horaOcupacion?: string;
  pedidoId?: string;
}
