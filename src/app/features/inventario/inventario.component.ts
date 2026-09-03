import { DatePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ItemInventario } from '../../core/models';
import { InventarioService } from '../../core/services/inventario.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ItemFormDialogComponent } from './item-form-dialog.component';
import { MovimientoInventarioDialogComponent } from './movimiento-inventario-dialog.component';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [DatePipe, MatButtonModule, MatDialogModule, MatIconModule, MatTableModule, MatTooltipModule, PageHeaderComponent],
  templateUrl: './inventario.component.html',
})
export class InventarioComponent {
  columnas = ['nombre', 'stock', 'costo', 'acciones'];
  soloBajoMinimo = signal(false);

  items = computed(() =>
    this.soloBajoMinimo() ? this.inventarioService.bajoMinimo() : this.inventarioService.items(),
  );

  bajoMinimo = this.inventarioService.bajoMinimo;
  movimientos = computed(() => this.inventarioService.movimientos().slice(0, 12));

  constructor(
    public inventarioService: InventarioService,
    private dialog: MatDialog,
  ) {}

  porcentaje(item: ItemInventario) {
    if (item.stockMinimo === 0) return 100;
    return Math.min((item.stockActual / (item.stockMinimo * 2)) * 100, 100);
  }

  nuevoItem() {
    const ref = this.dialog.open(ItemFormDialogComponent, { width: '520px', data: {} });
    ref.afterClosed().subscribe((valor) => {
      if (valor) this.inventarioService.crearItem(valor);
    });
  }

  editarItem(item: ItemInventario) {
    const ref = this.dialog.open(ItemFormDialogComponent, { width: '520px', data: { item } });
    ref.afterClosed().subscribe((valor) => {
      if (valor) this.inventarioService.actualizarItem(item.id, valor);
    });
  }

  registrarMovimiento(item: ItemInventario) {
    const ref = this.dialog.open(MovimientoInventarioDialogComponent, { width: '460px', data: { item } });
    ref.afterClosed().subscribe((valor) => {
      if (valor) this.inventarioService.registrarMovimiento(item.id, valor.tipo, valor.cantidad, valor.motivo);
    });
  }

  eliminarItem(item: ItemInventario) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Eliminar insumo',
        message: `¿Deseas eliminar "${item.nombre}" del inventario?`,
        confirmLabel: 'Eliminar',
        danger: true,
      },
    });
    ref.afterClosed().subscribe((ok) => {
      if (ok) this.inventarioService.eliminarItem(item.id);
    });
  }
}
