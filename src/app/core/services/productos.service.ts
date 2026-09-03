import { Injectable, computed } from '@angular/core';
import { Categoria, Producto } from '../models';
import { createEntityStore, generateId } from '../utils/entity-store';

const CATEGORIAS: Categoria[] = [
  { id: 'cat-1', nombre: 'Cafés', orden: 1 },
  { id: 'cat-2', nombre: 'Bebidas Frías', orden: 2 },
  { id: 'cat-3', nombre: 'Lácteos y Yogures', orden: 3 },
  { id: 'cat-4', nombre: 'Panadería y Pastelería', orden: 4 },
  { id: 'cat-5', nombre: 'Desayunos y Salados', orden: 5 },
  { id: 'cat-6', nombre: 'Postres', orden: 6 },
];

export const PRODUCTOS_SEED: Producto[] = [
  { id: 'prod-1', nombre: 'Espresso', descripcion: 'Shot de espresso, grano tostado en casa.', categoriaId: 'cat-1', tipo: 'bebida', precio: 6, costoEstimado: 1.8, disponible: true, imagenEmoji: '☕', destacado: false },
  { id: 'prod-2', nombre: 'Americano', descripcion: 'Espresso alargado con agua caliente.', categoriaId: 'cat-1', tipo: 'bebida', precio: 7, costoEstimado: 2, disponible: true, imagenEmoji: '☕', destacado: false },
  { id: 'prod-3', nombre: 'Cappuccino', descripcion: 'Espresso, leche vaporizada y espuma cremosa.', categoriaId: 'cat-1', tipo: 'bebida', precio: 10, costoEstimado: 3.2, disponible: true, imagenEmoji: '☕', destacado: true },
  { id: 'prod-4', nombre: 'Café con leche', descripcion: 'Clásico café con leche fresca Tirol.', categoriaId: 'cat-1', tipo: 'bebida', precio: 9, costoEstimado: 3, disponible: true, imagenEmoji: '☕', destacado: false },
  { id: 'prod-5', nombre: 'Mocaccino', descripcion: 'Espresso, chocolate y leche vaporizada.', categoriaId: 'cat-1', tipo: 'bebida', precio: 12, costoEstimado: 4, disponible: true, imagenEmoji: '☕', destacado: false },
  { id: 'prod-6', nombre: 'Latte de vainilla', descripcion: 'Café latte con esencia de vainilla.', categoriaId: 'cat-1', tipo: 'bebida', precio: 12, costoEstimado: 4.2, disponible: true, imagenEmoji: '☕', destacado: false },
  { id: 'prod-7', nombre: 'Frappé de café', descripcion: 'Café helado batido con hielo y leche.', categoriaId: 'cat-2', tipo: 'bebida', precio: 14, costoEstimado: 4.5, disponible: true, imagenEmoji: '🥤', destacado: true },
  { id: 'prod-8', nombre: 'Limonada frozen', descripcion: 'Limonada frappé bien helada.', categoriaId: 'cat-2', tipo: 'bebida', precio: 11, costoEstimado: 3, disponible: true, imagenEmoji: '🥤', destacado: false },
  { id: 'prod-9', nombre: 'Chicha morada', descripcion: 'Vaso grande, receta de la casa.', categoriaId: 'cat-2', tipo: 'bebida', precio: 8, costoEstimado: 2, disponible: true, imagenEmoji: '🥤', destacado: false },
  { id: 'prod-10', nombre: 'Jugo de fresa con leche', descripcion: 'Fresa natural con leche Tirol.', categoriaId: 'cat-2', tipo: 'bebida', precio: 12, costoEstimado: 4, disponible: true, imagenEmoji: '🥤', destacado: false },
  { id: 'prod-11', nombre: 'Yogurt natural 1L', descripcion: 'Producción propia Tirol Lácteos.', categoriaId: 'cat-3', tipo: 'plato', precio: 15, costoEstimado: 6, disponible: true, imagenEmoji: '🥛', destacado: false },
  { id: 'prod-12', nombre: 'Yogurt frutado vaso', descripcion: 'Sabor a elección: fresa, lúcuma o durazno.', categoriaId: 'cat-3', tipo: 'plato', precio: 8, costoEstimado: 3, disponible: true, imagenEmoji: '🥛', destacado: false },
  { id: 'prod-13', nombre: 'Queso fresco (x kg)', descripcion: 'Queso fresco artesanal Tirol.', categoriaId: 'cat-3', tipo: 'plato', precio: 28, costoEstimado: 16, disponible: true, imagenEmoji: '🧀', destacado: false },
  { id: 'prod-14', nombre: 'Manjar blanco 500g', descripcion: 'Manjar blanco casero, envase de vidrio.', categoriaId: 'cat-3', tipo: 'plato', precio: 18, costoEstimado: 9, disponible: true, imagenEmoji: '🍯', destacado: false },
  { id: 'prod-15', nombre: 'Bowl de yogurt con granola', descripcion: 'Yogurt natural, granola y fruta de estación.', categoriaId: 'cat-3', tipo: 'plato', precio: 14, costoEstimado: 5, disponible: true, imagenEmoji: '🥣', destacado: true },
  { id: 'prod-16', nombre: 'Croissant', descripcion: 'Hojaldrado, horneado diario.', categoriaId: 'cat-4', tipo: 'postre', precio: 6, costoEstimado: 2, disponible: true, imagenEmoji: '🥐', destacado: false },
  { id: 'prod-17', nombre: 'Torta de chocolate', descripcion: 'Porción con ganache de chocolate.', categoriaId: 'cat-4', tipo: 'postre', precio: 13, costoEstimado: 4.5, disponible: true, imagenEmoji: '🍰', destacado: false },
  { id: 'prod-18', nombre: 'Cheesecake', descripcion: 'Porción con topping de frutos rojos.', categoriaId: 'cat-4', tipo: 'postre', precio: 15, costoEstimado: 5.5, disponible: true, imagenEmoji: '🍰', destacado: true },
  { id: 'prod-19', nombre: 'Alfajor Tirol', descripcion: 'Relleno de manjar blanco de la casa.', categoriaId: 'cat-4', tipo: 'postre', precio: 5, costoEstimado: 1.5, disponible: true, imagenEmoji: '🍪', destacado: false },
  { id: 'prod-20', nombre: 'Sandwich de pollo', descripcion: 'Pan artesanal, pollo, palta y vegetales.', categoriaId: 'cat-5', tipo: 'plato', precio: 12, costoEstimado: 4.5, disponible: true, imagenEmoji: '🥪', destacado: false },
  { id: 'prod-21', nombre: 'Tostadas con palta y queso', descripcion: 'Pan de campo, palta, queso fresco Tirol.', categoriaId: 'cat-5', tipo: 'plato', precio: 13, costoEstimado: 4.8, disponible: true, imagenEmoji: '🍞', destacado: false },
  { id: 'prod-22', nombre: 'Combo Desayuno Tirol', descripcion: 'Café + jugo + tostadas con queso y manjar.', categoriaId: 'cat-5', tipo: 'combo', precio: 18, costoEstimado: 7, disponible: true, imagenEmoji: '🍽️', destacado: true },
  { id: 'prod-23', nombre: 'Empanada de queso', descripcion: 'Masa horneada, relleno de queso Tirol.', categoriaId: 'cat-5', tipo: 'plato', precio: 6, costoEstimado: 2, disponible: false, imagenEmoji: '🥟', destacado: false },
  { id: 'prod-24', nombre: 'Mousse de maracuyá', descripcion: 'Postre helado de la casa.', categoriaId: 'cat-6', tipo: 'postre', precio: 12, costoEstimado: 4, disponible: true, imagenEmoji: '🍮', destacado: false },
  { id: 'prod-25', nombre: 'Helado artesanal (bola)', descripcion: 'Sabores rotativos, hecho con leche Tirol.', categoriaId: 'cat-6', tipo: 'postre', precio: 8, costoEstimado: 2.5, disponible: true, imagenEmoji: '🍨', destacado: false },
];

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private categoriaStore = createEntityStore<Categoria>(CATEGORIAS);
  private productoStore = createEntityStore<Producto>(PRODUCTOS_SEED);

  categorias = computed(() => [...this.categoriaStore.items()].sort((a, b) => a.orden - b.orden));
  productos = this.productoStore.items;
  disponibles = computed(() => this.productos().filter((p) => p.disponible));
  destacados = computed(() => this.productos().filter((p) => p.destacado && p.disponible));

  getById(id: string) {
    return this.productoStore.getById(id);
  }

  nombreCategoria(categoriaId: string) {
    return this.categoriaStore.getById(categoriaId)?.nombre ?? 'Sin categoría';
  }

  productosPorCategoria(categoriaId: string) {
    return computed(() => this.productos().filter((p) => p.categoriaId === categoriaId));
  }

  crear(data: Omit<Producto, 'id'>) {
    this.productoStore.add({ ...data, id: generateId('prod') });
  }

  actualizar(id: string, changes: Partial<Producto>) {
    this.productoStore.update(id, changes);
  }

  eliminar(id: string) {
    this.productoStore.remove(id);
  }

  alternarDisponibilidad(id: string) {
    const producto = this.getById(id);
    if (producto) this.productoStore.update(id, { disponible: !producto.disponible });
  }
}
