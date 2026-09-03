import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ESTADOS_ORDEN_COMPRA, OrdenCompra, Proveedor } from '../../core/models';
import { ComprasService } from '../../core/services/compras.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusChipComponent } from '../../shared/components/status-chip/status-chip.component';
import { OrdenFormDialogComponent } from './orden-form-dialog.component';
import { ProveedorFormDialogComponent } from './proveedor-form-dialog.component';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [
    DatePipe,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule,
    PageHeaderComponent,
    EmptyStateComponent,
    StatusChipComponent,
  ],
  templateUrl: './compras.component.html',
})
export class ComprasComponent {
  proveedores = this.comprasService.proveedores;
  ordenes = this.comprasService.ordenes;

  constructor(
    public comprasService: ComprasService,
    private dialog: MatDialog,
  ) {}

  estadoInfo(orden: OrdenCompra) {
    return ESTADOS_ORDEN_COMPRA[orden.estado];
  }

  total(orden: OrdenCompra) {
    return this.comprasService.totalOrden(orden);
  }

  nuevoProveedor() {
    const ref = this.dialog.open(ProveedorFormDialogComponent, { width: '520px', data: {} });
    ref.afterClosed().subscribe((valor) => {
      if (valor) this.comprasService.crearProveedor(valor);
    });
  }

  editarProveedor(proveedor: Proveedor) {
    const ref = this.dialog.open(ProveedorFormDialogComponent, { width: '520px', data: { proveedor } });
    ref.afterClosed().subscribe((valor) => {
      if (valor) this.comprasService.actualizarProveedor(proveedor.id, valor);
    });
  }

  eliminarProveedor(proveedor: Proveedor) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: { title: 'Eliminar proveedor', message: `¿Eliminar a "${proveedor.nombre}"?`, confirmLabel: 'Eliminar', danger: true },
    });
    ref.afterClosed().subscribe((ok) => {
      if (ok) this.comprasService.eliminarProveedor(proveedor.id);
    });
  }

  nuevaOrden() {
    if (this.proveedores().length === 0) return;
    const ref = this.dialog.open(OrdenFormDialogComponent, { width: '620px', data: { proveedores: this.proveedores() } });
    ref.afterClosed().subscribe((valor) => {
      if (valor) this.comprasService.crearOrden(valor.proveedorId, valor.items);
    });
  }

  marcarRecibida(orden: OrdenCompra) {
    this.comprasService.marcarRecibida(orden.id);
  }

  anularOrden(orden: OrdenCompra) {
    this.comprasService.anularOrden(orden.id);
  }
}
