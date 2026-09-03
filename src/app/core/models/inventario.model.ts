export type TipoMovimientoInventario = 'entrada' | 'salida' | 'merma' | 'ajuste';

export const TIPOS_MOVIMIENTO_INVENTARIO: { value: TipoMovimientoInventario; label: string }[] = [
  { value: 'entrada', label: 'Entrada' },
  { value: 'salida', label: 'Salida' },
  { value: 'merma', label: 'Merma' },
  { value: 'ajuste', label: 'Ajuste' },
];

export interface ItemInventario {
  id: string;
  nombre: string;
  categoria: string;
  unidad: string;
  stockActual: number;
  stockMinimo: number;
  costoUnitario: number;
}

export interface MovimientoInventario {
  id: string;
  itemId: string;
  itemNombre: string;
  tipo: TipoMovimientoInventario;
  cantidad: number;
  motivo: string;
  fecha: string;
}
