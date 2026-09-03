import { Injectable, computed } from '@angular/core';
import { ItemInventario, MovimientoInventario } from '../models';
import { createEntityStore, generateId } from '../utils/entity-store';

function haceHoras(h: number): string {
  return new Date(Date.now() - h * 3600000).toISOString();
}

const ITEMS_SEED: ItemInventario[] = [
  { id: 'inv-1', nombre: 'Café molido', categoria: 'Insumos secos', unidad: 'kg', stockActual: 8.4, stockMinimo: 5, costoUnitario: 42 },
  { id: 'inv-2', nombre: 'Leche entera', categoria: 'Lácteos', unidad: 'L', stockActual: 22, stockMinimo: 25, costoUnitario: 4.2 },
  { id: 'inv-3', nombre: 'Azúcar blanca', categoria: 'Insumos secos', unidad: 'kg', stockActual: 14, stockMinimo: 8, costoUnitario: 3.6 },
  { id: 'inv-4', nombre: 'Pan artesanal', categoria: 'Panadería', unidad: 'unid', stockActual: 36, stockMinimo: 20, costoUnitario: 1.1 },
  { id: 'inv-5', nombre: 'Pechuga de pollo', categoria: 'Carnes', unidad: 'kg', stockActual: 6.2, stockMinimo: 6, costoUnitario: 18.5 },
  { id: 'inv-6', nombre: 'Palta', categoria: 'Frutas y verduras', unidad: 'kg', stockActual: 3.1, stockMinimo: 4, costoUnitario: 6.8 },
  { id: 'inv-7', nombre: 'Queso crema', categoria: 'Lácteos', unidad: 'kg', stockActual: 5.5, stockMinimo: 4, costoUnitario: 22 },
  { id: 'inv-8', nombre: 'Fresa', categoria: 'Frutas y verduras', unidad: 'kg', stockActual: 4.8, stockMinimo: 5, costoUnitario: 9.5 },
  { id: 'inv-9', nombre: 'Granola', categoria: 'Insumos secos', unidad: 'kg', stockActual: 7, stockMinimo: 4, costoUnitario: 16 },
  { id: 'inv-10', nombre: 'Yogurt natural (insumo base)', categoria: 'Lácteos', unidad: 'L', stockActual: 18, stockMinimo: 15, costoUnitario: 8.5 },
  { id: 'inv-11', nombre: 'Vasos descartables 12oz', categoria: 'Descartables', unidad: 'unid', stockActual: 140, stockMinimo: 150, costoUnitario: 0.28 },
  { id: 'inv-12', nombre: 'Servilletas', categoria: 'Descartables', unidad: 'paquete', stockActual: 9, stockMinimo: 6, costoUnitario: 5.5 },
  { id: 'inv-13', nombre: 'Base de galleta (cheesecake)', categoria: 'Panadería', unidad: 'kg', stockActual: 2.4, stockMinimo: 3, costoUnitario: 14 },
  { id: 'inv-14', nombre: 'Frutos rojos', categoria: 'Frutas y verduras', unidad: 'kg', stockActual: 3.6, stockMinimo: 3, costoUnitario: 24 },
];

const MOVIMIENTOS_SEED: MovimientoInventario[] = [
  { id: 'mvi-1', itemId: 'inv-2', itemNombre: 'Leche entera', tipo: 'salida', cantidad: 18, motivo: 'Consumo del día', fecha: haceHoras(3) },
  { id: 'mvi-2', itemId: 'inv-6', itemNombre: 'Palta', tipo: 'salida', cantidad: 2.5, motivo: 'Consumo del día', fecha: haceHoras(4) },
  { id: 'mvi-3', itemId: 'inv-11', itemNombre: 'Vasos descartables 12oz', tipo: 'salida', cantidad: 60, motivo: 'Consumo del día', fecha: haceHoras(5) },
  { id: 'mvi-4', itemId: 'inv-1', itemNombre: 'Café molido', tipo: 'entrada', cantidad: 5, motivo: 'Compra a proveedor Norfagro', fecha: haceHoras(26) },
  { id: 'mvi-5', itemId: 'inv-13', itemNombre: 'Base de galleta (cheesecake)', tipo: 'merma', cantidad: 0.6, motivo: 'Producto vencido', fecha: haceHoras(30) },
  { id: 'mvi-6', itemId: 'inv-9', itemNombre: 'Granola', tipo: 'ajuste', cantidad: 0.5, motivo: 'Ajuste tras inventario físico', fecha: haceHoras(48) },
];

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private itemStore = createEntityStore<ItemInventario>(ITEMS_SEED);
  private movimientoStore = createEntityStore<MovimientoInventario>(MOVIMIENTOS_SEED);

  items = this.itemStore.items;
  movimientos = computed(() =>
    [...this.movimientoStore.items()].sort((a, b) => (a.fecha < b.fecha ? 1 : -1)),
  );

  bajoMinimo = computed(() => this.items().filter((i) => i.stockActual < i.stockMinimo));

  getById(id: string) {
    return this.itemStore.getById(id);
  }

  crearItem(data: Omit<ItemInventario, 'id'>) {
    this.itemStore.add({ ...data, id: generateId('inv') });
  }

  actualizarItem(id: string, changes: Partial<ItemInventario>) {
    this.itemStore.update(id, changes);
  }

  eliminarItem(id: string) {
    this.itemStore.remove(id);
  }

  registrarMovimiento(itemId: string, tipo: MovimientoInventario['tipo'], cantidad: number, motivo: string) {
    const item = this.getById(itemId);
    if (!item) return;
    const delta = tipo === 'entrada' || (tipo === 'ajuste' && cantidad > 0) ? cantidad : -Math.abs(cantidad);
    const nuevoStock = tipo === 'ajuste' ? item.stockActual + cantidad : Math.max(item.stockActual + delta, 0);
    this.itemStore.update(itemId, { stockActual: nuevoStock });
    this.movimientoStore.add({
      id: generateId('mvi'),
      itemId,
      itemNombre: item.nombre,
      tipo,
      cantidad: Math.abs(cantidad),
      motivo,
      fecha: new Date().toISOString(),
    });
  }
}
