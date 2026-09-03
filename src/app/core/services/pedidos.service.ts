import { Injectable, computed } from '@angular/core';
import { Estacion, EstadoItemPedido, EstadoPedido, ItemPedido, Pedido } from '../models';
import { createEntityStore, generateId } from '../utils/entity-store';
import { createSeededRandom, pickInt, pickItem } from '../utils/seeded-random';
import { PRODUCTOS_SEED } from './productos.service';
import { USUARIOS_SEED } from './usuarios.service';

function estacionParaCategoria(categoriaId: string): Estacion {
  switch (categoriaId) {
    case 'cat-4':
    case 'cat-6':
      return 'postres';
    case 'cat-5':
      return 'cocina';
    default:
      return 'barra';
  }
}

function item(productoId: string, cantidad: number, estado: EstadoItemPedido, observacion?: string): ItemPedido {
  const producto = PRODUCTOS_SEED.find((p) => p.id === productoId)!;
  return {
    id: generateId('item'),
    productoId,
    nombreProducto: producto.nombre,
    cantidad,
    precioUnitario: producto.precio,
    observacion,
    estacion: estacionParaCategoria(producto.categoriaId),
    estado,
  };
}

const ACTIVOS: Pedido[] = [
  {
    id: 'ped-1',
    numero: 'C-0231',
    mesaId: 'mesa-1',
    numeroMesa: 1,
    canal: 'salon',
    mozoId: 'usr-3',
    mozoNombre: 'Jhon Ríos',
    items: [
      item('prod-3', 2, 'listo'),
      item('prod-16', 1, 'listo'),
      item('prod-20', 1, 'en-preparacion', 'sin cebolla'),
    ],
    estado: 'en-cocina',
    descuento: 0,
    creadoEn: new Date(Date.now() - 18 * 60000).toISOString(),
    actualizadoEn: new Date(Date.now() - 3 * 60000).toISOString(),
  },
  {
    id: 'ped-2',
    numero: 'C-0230',
    mesaId: 'mesa-3',
    numeroMesa: 3,
    canal: 'salon',
    mozoId: 'usr-4',
    mozoNombre: 'Karen Mori',
    items: [item('prod-4', 2, 'entregado'), item('prod-18', 2, 'entregado')],
    estado: 'por-cobrar',
    descuento: 0,
    creadoEn: new Date(Date.now() - 42 * 60000).toISOString(),
    actualizadoEn: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'ped-3',
    numero: 'C-0232',
    mesaId: 'mesa-5',
    numeroMesa: 5,
    canal: 'salon',
    mozoId: 'usr-3',
    mozoNombre: 'Jhon Ríos',
    items: [item('prod-7', 1, 'pendiente'), item('prod-22', 1, 'pendiente', 'extra tostadas')],
    estado: 'abierto',
    descuento: 0,
    creadoEn: new Date(Date.now() - 9 * 60000).toISOString(),
    actualizadoEn: new Date(Date.now() - 9 * 60000).toISOString(),
  },
  {
    id: 'ped-4',
    numero: 'C-0233',
    mesaId: 'mesa-8',
    numeroMesa: 8,
    canal: 'salon',
    mozoId: 'usr-4',
    mozoNombre: 'Karen Mori',
    items: [
      item('prod-15', 1, 'en-preparacion'),
      item('prod-10', 1, 'listo'),
      item('prod-24', 1, 'pendiente'),
    ],
    estado: 'en-cocina',
    descuento: 0,
    creadoEn: new Date(Date.now() - 25 * 60000).toISOString(),
    actualizadoEn: new Date(Date.now() - 2 * 60000).toISOString(),
  },
];

function generarHistorico(): Pedido[] {
  const rng = createSeededRandom(20260902);
  const disponibles = PRODUCTOS_SEED.filter((p) => p.disponible);
  const mozos = USUARIOS_SEED.filter((u) => u.rol === 'mozo');
  const historico: Pedido[] = [];
  let contador = 100;

  const horaActual = new Date().getHours();

  for (let diasAtras = 13; diasAtras >= 0; diasAtras--) {
    const esHoy = diasAtras === 0;
    const fechaBase = new Date();
    fechaBase.setDate(fechaBase.getDate() - diasAtras);
    const horaMaxima = esHoy ? Math.max(horaActual, 8) : 21;
    const pedidosDelDia = esHoy ? pickInt(rng, 4, 9) : pickInt(rng, 8, 16);

    for (let n = 0; n < pedidosDelDia; n++) {
      contador++;
      const cantidadItems = pickInt(rng, 1, 4);
      const items: ItemPedido[] = [];
      for (let i = 0; i < cantidadItems; i++) {
        const producto = pickItem(rng, disponibles);
        items.push(item(producto.id, pickInt(rng, 1, 3), 'entregado'));
      }
      const mozo = pickItem(rng, mozos);
      const hora = pickInt(rng, 7, horaMaxima);
      const minuto = pickInt(rng, 0, 59);
      const fecha = new Date(fechaBase);
      fecha.setHours(hora, minuto, 0, 0);
      const medios: Pedido['medioPago'][] = ['efectivo', 'yape', 'plin', 'tarjeta'];
      const canales: Pedido['canal'][] = ['salon', 'salon', 'salon', 'para-llevar', 'delivery'];

      historico.push({
        id: generateId('ped-hist'),
        numero: `C-${contador}`,
        canal: pickItem(rng, canales),
        numeroMesa: pickInt(rng, 1, 12),
        mozoId: mozo.id,
        mozoNombre: mozo.nombres,
        items,
        estado: 'cerrado',
        medioPago: pickItem(rng, medios),
        descuento: 0,
        creadoEn: fecha.toISOString(),
        actualizadoEn: fecha.toISOString(),
      });
    }
  }
  return historico;
}

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private store = createEntityStore<Pedido>([...ACTIVOS, ...generarHistorico()]);

  pedidos = this.store.items;

  activos = computed(() =>
    this.pedidos()
      .filter((p) => !['cerrado', 'anulado'].includes(p.estado))
      .sort((a, b) => (a.creadoEn < b.creadoEn ? 1 : -1)),
  );

  cerrados = computed(() => this.pedidos().filter((p) => p.estado === 'cerrado'));

  getById(id: string) {
    return this.store.getById(id);
  }

  totalPedido(pedido: Pedido): number {
    const bruto = pedido.items.reduce((acc, it) => acc + it.cantidad * it.precioUnitario, 0);
    return Math.max(bruto - pedido.descuento, 0);
  }

  crear(data: Omit<Pedido, 'id' | 'creadoEn' | 'actualizadoEn'>) {
    const ahora = new Date().toISOString();
    const pedido: Pedido = { ...data, id: generateId('ped'), creadoEn: ahora, actualizadoEn: ahora };
    this.store.add(pedido);
    return pedido;
  }

  actualizar(id: string, changes: Partial<Pedido>) {
    this.store.update(id, { ...changes, actualizadoEn: new Date().toISOString() });
  }

  agregarItem(pedidoId: string, nuevoItem: Omit<ItemPedido, 'id'>) {
    const pedido = this.getById(pedidoId);
    if (!pedido) return;
    const items = [...pedido.items, { ...nuevoItem, id: generateId('item') }];
    this.actualizar(pedidoId, { items });
  }

  cambiarCantidadItem(pedidoId: string, itemId: string, cantidad: number) {
    const pedido = this.getById(pedidoId);
    if (!pedido) return;
    const items = pedido.items
      .map((it) => (it.id === itemId ? { ...it, cantidad } : it))
      .filter((it) => it.cantidad > 0);
    this.actualizar(pedidoId, { items });
  }

  quitarItem(pedidoId: string, itemId: string) {
    const pedido = this.getById(pedidoId);
    if (!pedido) return;
    this.actualizar(pedidoId, { items: pedido.items.filter((it) => it.id !== itemId) });
  }

  cambiarEstadoItem(pedidoId: string, itemId: string, estado: EstadoItemPedido) {
    const pedido = this.getById(pedidoId);
    if (!pedido) return;
    const items = pedido.items.map((it) => (it.id === itemId ? { ...it, estado } : it));
    this.actualizar(pedidoId, { items });
  }

  cambiarEstadoPedido(pedidoId: string, estado: EstadoPedido) {
    this.actualizar(pedidoId, { estado });
  }

  cerrarConPago(pedidoId: string, medioPago: Pedido['medioPago']) {
    this.actualizar(pedidoId, { estado: 'cerrado', medioPago });
  }
}
