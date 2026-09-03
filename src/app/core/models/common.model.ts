export type Rol = 'admin' | 'mozo' | 'cajero' | 'cocina';

export const ROLES: { value: Rol; label: string }[] = [
  { value: 'admin', label: 'Administrador' },
  { value: 'mozo', label: 'Mozo' },
  { value: 'cajero', label: 'Cajero' },
  { value: 'cocina', label: 'Cocina' },
];

export type MedioPago = 'efectivo' | 'yape' | 'plin' | 'tarjeta';

export const MEDIOS_PAGO: { value: MedioPago; label: string; icon: string }[] = [
  { value: 'efectivo', label: 'Efectivo', icon: 'payments' },
  { value: 'yape', label: 'Yape', icon: 'smartphone' },
  { value: 'plin', label: 'Plin', icon: 'smartphone' },
  { value: 'tarjeta', label: 'Tarjeta', icon: 'credit_card' },
];

export interface Tone {
  label: string;
  tone: 'neutral' | 'info' | 'success' | 'warn' | 'danger' | 'brand';
}
