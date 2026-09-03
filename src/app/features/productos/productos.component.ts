import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ProductosService } from '../../core/services/productos.service';
import { Producto } from '../../core/models';
import { ProductoFormDialogComponent } from './producto-form-dialog.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    PageHeaderComponent,
    EmptyStateComponent,
  ],
  templateUrl: './productos.component.html',
})
export class ProductosComponent {
  columnas = ['producto', 'categoria', 'precio', 'margen', 'disponible', 'acciones'];
  categoriaSeleccionada = signal<string | 'todas'>('todas');
  busqueda = signal('');

  categorias = this.productosService.categorias;

  filtrados = computed(() => {
    const cat = this.categoriaSeleccionada();
    const texto = this.busqueda().trim().toLowerCase();
    return this.productosService.productos().filter((p) => {
      const coincideCategoria = cat === 'todas' || p.categoriaId === cat;
      const coincideTexto = !texto || p.nombre.toLowerCase().includes(texto);
      return coincideCategoria && coincideTexto;
    });
  });

  constructor(
    private productosService: ProductosService,
    private dialog: MatDialog,
  ) {}

  margen(p: Producto): number {
    if (p.precio === 0) return 0;
    return ((p.precio - p.costoEstimado) / p.precio) * 100;
  }

  nombreCategoria(id: string) {
    return this.productosService.nombreCategoria(id);
  }

  actualizarBusqueda(valor: string) {
    this.busqueda.set(valor);
  }

  nuevoProducto() {
    const ref = this.dialog.open(ProductoFormDialogComponent, {
      width: '640px',
      data: { categorias: this.categorias() },
    });
    ref.afterClosed().subscribe((valor) => {
      if (valor) this.productosService.crear(valor);
    });
  }

  editarProducto(producto: Producto) {
    const ref = this.dialog.open(ProductoFormDialogComponent, {
      width: '640px',
      data: { categorias: this.categorias(), producto },
    });
    ref.afterClosed().subscribe((valor) => {
      if (valor) this.productosService.actualizar(producto.id, valor);
    });
  }

  eliminarProducto(producto: Producto) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Eliminar producto',
        message: `¿Deseas eliminar "${producto.nombre}" de la carta? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
        danger: true,
      },
    });
    ref.afterClosed().subscribe((confirmado) => {
      if (confirmado) this.productosService.eliminar(producto.id);
    });
  }

  alternarDisponibilidad(producto: Producto) {
    this.productosService.alternarDisponibilidad(producto.id);
  }
}
