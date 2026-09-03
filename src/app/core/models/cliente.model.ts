export interface Cliente {
  id: string;
  nombres: string;
  telefono: string;
  email?: string;
  direccion?: string;
  visitas: number;
  consumoTotal: number;
  ultimaVisita?: string;
  preferencias?: string;
}
