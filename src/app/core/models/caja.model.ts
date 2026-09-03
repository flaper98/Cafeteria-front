import { MedioPago } from './common.model';

export type TipoMovimientoCaja = 'ingreso' | 'egreso' | 'venta';

export interface MovimientoCaja {
  id: string;
  turnoId: string;
  tipo: TipoMovimientoCaja;
  concepto: string;
  monto: number;
  medioPago?: MedioPago;
  hora: string;
}

export interface TurnoCaja {
  id: string;
  cajeroId: string;
  cajeroNombre: string;
  montoApertura: number;
  aperturaEn: string;
  cierreEn?: string;
  montoCierreContado?: number;
  estado: 'abierto' | 'cerrado';
}
