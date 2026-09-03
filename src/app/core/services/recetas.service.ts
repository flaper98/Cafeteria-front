import { Injectable, computed } from '@angular/core';
import { InsumoReceta, Receta } from '../models';
import { createEntityStore, generateId } from '../utils/entity-store';

function insumo(nombre: string, cantidad: number, unidad: string, costoUnitario: number): InsumoReceta {
  return { id: generateId('insumo'), nombre, cantidad, unidad, costoUnitario };
}

const SEED: Receta[] = [
  {
    id: 'rec-1',
    productoId: 'prod-3',
    rendimiento: 1,
    insumos: [
      insumo('Café molido', 18, 'g', 0.09),
      insumo('Leche entera', 120, 'ml', 0.012),
      insumo('Azúcar', 5, 'g', 0.006),
    ],
  },
  {
    id: 'rec-2',
    productoId: 'prod-20',
    rendimiento: 1,
    insumos: [
      insumo('Pan artesanal', 1, 'unid', 1.2),
      insumo('Pechuga de pollo', 80, 'g', 0.022),
      insumo('Palta', 40, 'g', 0.02),
      insumo('Vegetales mix', 30, 'g', 0.02),
    ],
  },
  {
    id: 'rec-3',
    productoId: 'prod-22',
    rendimiento: 1,
    notas: 'Incluye café con leche + jugo de fresa + tostadas con queso y manjar.',
    insumos: [
      insumo('Café molido', 12, 'g', 0.09),
      insumo('Leche entera', 210, 'ml', 0.012),
      insumo('Fresa', 80, 'g', 0.015),
      insumo('Pan de campo', 1, 'unid', 1.0),
      insumo('Queso fresco', 40, 'g', 0.016),
      insumo('Manjar blanco', 20, 'g', 0.018),
    ],
  },
  {
    id: 'rec-4',
    productoId: 'prod-18',
    rendimiento: 8,
    notas: 'Rinde 8 porciones por torta.',
    insumos: [
      insumo('Base de galleta', 320, 'g', 0.03),
      insumo('Queso crema', 720, 'g', 0.035),
      insumo('Frutos rojos', 160, 'g', 0.05),
    ],
  },
  {
    id: 'rec-5',
    productoId: 'prod-15',
    rendimiento: 1,
    insumos: [
      insumo('Yogurt natural', 180, 'ml', 0.012),
      insumo('Granola', 40, 'g', 0.028),
      insumo('Fruta de estación', 60, 'g', 0.02),
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class RecetasService {
  private store = createEntityStore<Receta>(SEED);

  recetas = this.store.items;

  getByProducto(productoId: string) {
    return computed(() => this.recetas().find((r) => r.productoId === productoId));
  }

  costoPorPorcion(receta: Receta): number {
    const costoTotal = receta.insumos.reduce((acc, i) => acc + i.cantidad * i.costoUnitario, 0);
    return receta.rendimiento > 0 ? costoTotal / receta.rendimiento : costoTotal;
  }

  guardar(productoId: string, insumos: InsumoReceta[], rendimiento: number, notas?: string) {
    const existente = this.recetas().find((r) => r.productoId === productoId);
    if (existente) {
      this.store.update(existente.id, { insumos, rendimiento, notas });
    } else {
      this.store.add({ id: generateId('rec'), productoId, insumos, rendimiento, notas });
    }
  }

  eliminar(id: string) {
    this.store.remove(id);
  }
}
