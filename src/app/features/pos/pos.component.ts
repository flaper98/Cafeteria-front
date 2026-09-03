import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CanalPedido, Estacion, ItemPedido, Producto } from '../../core/models';
import { AuthService } from '../../core/services/auth.service';
import { MesasService } from '../../core/services/mesas.service';
import { PedidosService } from '../../core/services/pedidos.service';
import { ProductosService } from '../../core/services/productos.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { PagoDialogComponent } from './pago-dialog.component';

interface LineaCarrito {
  producto: Producto;
  cantidad: number;
  observacion?: string;
}

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

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    PageHeaderComponent,
    EmptyStateComponent,
  ],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss',
})
export class PosComponent {
  categorias = this.productosService.categorias;
  categoriaActiva = signal<string>('todas');

  canal = signal<CanalPedido>('salon');
  mesaSeleccionadaId = signal<string | null>(null);
  carritoNuevo = signal<LineaCarrito[]>([]);
  descuento = signal(0);

  mesasDisponibles = computed(() =>
    [...this.mesasService.mesas()]
      .filter((m) => m.estado !== 'reservada')
      .sort((a, b) => a.numero - b.numero),
  );

  mesaSeleccionada = computed(() => {
    const id = this.mesaSeleccionadaId();
    return id ? this.mesasService.getById(id) : undefined;
  });

  pedidoExistente = computed(() => {
    const mesa = this.mesaSeleccionada();
    return mesa?.pedidoId ? this.pedidosService.getById(mesa.pedidoId) : undefined;
  });

  productosFiltrados = computed(() => {
    const cat = this.categoriaActiva();
    return this.productosService
      .disponibles()
      .filter((p) => cat === 'todas' || p.categoriaId === cat);
  });

  totalExistente = computed(() => {
    const p = this.pedidoExistente();
    return p ? this.pedidosService.totalPedido(p) : 0;
  });

  totalNuevo = computed(() =>
    this.carritoNuevo().reduce((acc, l) => acc + l.cantidad * l.producto.precio, 0),
  );

  totalGeneral = computed(() =>
    Math.max(this.totalExistente() + this.totalNuevo() - this.descuento(), 0),
  );

  hayAlgoQueEnviar = computed(() => this.carritoNuevo().length > 0);
  hayAlgoQueCobrar = computed(() => this.totalGeneral() > 0);

  constructor(
    private productosService: ProductosService,
    private mesasService: MesasService,
    private pedidosService: PedidosService,
    private auth: AuthService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    const mesaQuery = this.route.snapshot.queryParamMap.get('mesa');
    if (mesaQuery) {
      this.canal.set('salon');
      this.mesaSeleccionadaId.set(mesaQuery);
    }
  }

  seleccionarCategoria(id: string) {
    this.categoriaActiva.set(id);
  }

  cambiarCanal(canal: CanalPedido) {
    this.canal.set(canal);
    if (canal !== 'salon') this.mesaSeleccionadaId.set(null);
  }

  seleccionarMesa(id: string) {
    this.mesaSeleccionadaId.set(id || null);
  }

  agregarProducto(producto: Producto) {
    this.carritoNuevo.update((lineas) => {
      const idx = lineas.findIndex((l) => l.producto.id === producto.id);
      if (idx === -1) return [...lineas, { producto, cantidad: 1 }];
      const copia = [...lineas];
      copia[idx] = { ...copia[idx], cantidad: copia[idx].cantidad + 1 };
      return copia;
    });
  }

  cambiarCantidad(index: number, delta: number) {
    this.carritoNuevo.update((lineas) => {
      const copia = [...lineas];
      const nuevaCantidad = copia[index].cantidad + delta;
      if (nuevaCantidad <= 0) {
        copia.splice(index, 1);
      } else {
        copia[index] = { ...copia[index], cantidad: nuevaCantidad };
      }
      return copia;
    });
  }

  quitarLinea(index: number) {
    this.carritoNuevo.update((lineas) => lineas.filter((_, i) => i !== index));
  }

  private itemsDelCarrito(): Omit<ItemPedido, 'id'>[] {
    return this.carritoNuevo().map((l) => ({
      productoId: l.producto.id,
      nombreProducto: l.producto.nombre,
      cantidad: l.cantidad,
      precioUnitario: l.producto.precio,
      observacion: l.observacion,
      estacion: estacionParaCategoria(l.producto.categoriaId),
      estado: 'pendiente' as const,
    }));
  }

  private asegurarPedido(): string | null {
    const usuario = this.auth.currentUser();
    if (!usuario) return null;

    const existente = this.pedidoExistente();
    if (existente) {
      if (this.hayAlgoQueEnviar()) {
        for (const item of this.itemsDelCarrito()) this.pedidosService.agregarItem(existente.id, item);
        if (existente.estado === 'abierto') this.pedidosService.cambiarEstadoPedido(existente.id, 'en-cocina');
      }
      this.carritoNuevo.set([]);
      return existente.id;
    }

    if (this.carritoNuevo().length === 0) return null;

    const mesa = this.mesaSeleccionada();
    const pedido = this.pedidosService.crear({
      numero: `C-${Math.floor(Math.random() * 900 + 100)}`,
      mesaId: mesa?.id,
      numeroMesa: mesa?.numero,
      canal: this.canal(),
      mozoId: usuario.id,
      mozoNombre: usuario.nombres,
      items: this.itemsDelCarrito() as ItemPedido[],
      estado: 'en-cocina',
      descuento: this.descuento(),
    });

    if (mesa) this.mesasService.ocupar(mesa.id, usuario.id, usuario.nombres, pedido.id);
    this.carritoNuevo.set([]);
    return pedido.id;
  }

  enviarACocina() {
    if (!this.hayAlgoQueEnviar()) return;
    this.asegurarPedido();
    this.snackBar.open('Pedido enviado a cocina', 'Cerrar', { duration: 2500 });
  }

  cobrar() {
    const pedidoId = this.asegurarPedido() ?? this.pedidoExistente()?.id;
    if (!pedidoId) return;

    const ref = this.dialog.open(PagoDialogComponent, {
      width: '380px',
      data: { total: this.totalGeneral() },
    });

    ref.afterClosed().subscribe((medio) => {
      if (!medio) return;
      this.pedidosService.cerrarConPago(pedidoId, medio);
      const mesa = this.mesaSeleccionada();
      if (mesa) {
        this.mesasService.liberar(mesa.id);
        this.mesaSeleccionadaId.set(null);
      }
      this.descuento.set(0);
      this.snackBar.open('Cobro registrado. ¡Gracias!', 'Cerrar', { duration: 2500 });
    });
  }
}
