export type TipoProducto = 'plato' | 'bebida' | 'combo' | 'postre' | 'adicional';

export const TIPOS_PRODUCTO: { value: TipoProducto; label: string }[] = [
  { value: 'plato', label: 'Plato' },
  { value: 'bebida', label: 'Bebida' },
  { value: 'combo', label: 'Combo' },
  { value: 'postre', label: 'Postre' },
  { value: 'adicional', label: 'Adicional' },
];

export interface Categoria {
  id: string;
  nombre: string;
  orden: number;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  categoriaId: string;
  tipo: TipoProducto;
  precio: number;
  costoEstimado: number;
  disponible: boolean;
  imagenEmoji: string;
  destacado: boolean;
}
