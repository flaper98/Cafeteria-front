export interface InsumoReceta {
  id: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  costoUnitario: number;
}

export interface Receta {
  id: string;
  productoId: string;
  insumos: InsumoReceta[];
  rendimiento: number;
  notas?: string;
}
