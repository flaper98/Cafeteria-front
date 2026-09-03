import { Component, Inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { StatusChipComponent } from '../../shared/components/status-chip/status-chip.component';
import { ESTADOS_MESA, Mesa } from '../../core/models';
import { MesasService } from '../../core/services/mesas.service';
import { PedidosService } from '../../core/services/pedidos.service';

@Component({
  selector: 'app-mesa-detalle-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, StatusChipComponent],
  template: `
    <div class="flex items-center justify-between px-6 pt-6">
      <div>
        <h2 class="text-xl font-semibold m-0">Mesa {{ data.mesa.numero }}</h2>
        <p class="text-sm text-stone-500 m-0">{{ data.mesa.zona }} · {{ data.mesa.capacidad }} personas</p>
      </div>
      <app-status-chip [label]="estadoInfo().label" [tone]="estadoInfo().tone"></app-status-chip>
    </div>

    <mat-dialog-content class="!pt-4">
      @if (pedido(); as p) {
        <div class="card-surface p-3 mb-3">
          <div class="flex justify-between items-center mb-2">
            <p class="font-medium m-0">Comanda {{ p.numero }}</p>
            <p class="font-semibold m-0">S/ {{ total().toFixed(2) }}</p>
          </div>
          <ul class="text-sm text-stone-600 space-y-1 m-0 pl-0 list-none">
            @for (it of p.items; track it.id) {
              <li class="flex justify-between">
                <span>{{ it.cantidad }}× {{ it.nombreProducto }}</span>
                <span>S/ {{ (it.cantidad * it.precioUnitario).toFixed(2) }}</span>
              </li>
            }
          </ul>
        </div>
        <p class="text-xs text-stone-500">
          Mozo a cargo: <strong>{{ data.mesa.mozoNombre }}</strong>
        </p>
      } @else if (data.mesa.estado === 'reservada') {
        <p class="text-sm text-stone-500">Esta mesa tiene una reserva próxima. Confirma la llegada para ocuparla.</p>
      } @else {
        <p class="text-sm text-stone-500">La mesa está libre y disponible para nuevos clientes.</p>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="flex-wrap gap-2">
      <button mat-button (click)="dialogRef.close()">Cerrar</button>

      @if (data.mesa.estado === 'libre' || data.mesa.estado === 'reservada') {
        <button mat-flat-button color="primary" (click)="irAPos()">
          <mat-icon>point_of_sale</mat-icon>
          Abrir pedido
        </button>
      }

      @if (data.mesa.estado === 'ocupada') {
        <button mat-stroked-button (click)="marcarPorCobrar()">Marcar por cobrar</button>
        <button mat-flat-button color="primary" (click)="irAPos()">
          <mat-icon>point_of_sale</mat-icon>
          Ir a comanda
        </button>
      }

      @if (data.mesa.estado === 'por-cobrar') {
        <button mat-flat-button color="primary" (click)="irAPos()">
          <mat-icon>payments</mat-icon>
          Cobrar
        </button>
      }

      @if (data.mesa.estado !== 'libre') {
        <button mat-stroked-button color="warn" (click)="liberar()">Liberar mesa</button>
      }
    </mat-dialog-actions>
  `,
})
export class MesaDetalleDialogComponent {
  estadoInfo = computed(() => ESTADOS_MESA[this.data.mesa.estado]);
  pedido = computed(() =>
    this.data.mesa.pedidoId ? this.pedidosService.getById(this.data.mesa.pedidoId) : undefined,
  );
  total = computed(() => {
    const p = this.pedido();
    return p ? this.pedidosService.totalPedido(p) : 0;
  });

  constructor(
    public dialogRef: MatDialogRef<MesaDetalleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mesa: Mesa },
    private mesasService: MesasService,
    private pedidosService: PedidosService,
    private router: Router,
  ) {}

  irAPos() {
    this.router.navigate(['/pos'], { queryParams: { mesa: this.data.mesa.id } });
    this.dialogRef.close();
  }

  marcarPorCobrar() {
    this.mesasService.marcarPorCobrar(this.data.mesa.id);
    if (this.data.mesa.pedidoId) this.pedidosService.cambiarEstadoPedido(this.data.mesa.pedidoId, 'por-cobrar');
    this.dialogRef.close();
  }

  liberar() {
    this.mesasService.liberar(this.data.mesa.id);
    this.dialogRef.close();
  }
}
