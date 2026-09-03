import { Rol } from './common.model';

export interface Usuario {
  id: string;
  nombres: string;
  usuario: string;
  password: string;
  rol: Rol;
  activo: boolean;
  ultimoAcceso?: string;
}
