import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ESTADOS_DELIVERY, EstadoDelivery, PedidoDelivery } from '../../core/models';
import { DeliveryService } from '../../core/services/delivery.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusChipComponent } from '../../shared/components/status-chip/status-chip.component';
import { DeliveryFormDialogComponent } from './delivery-form-dialog.component';

const REPARTIDORES = ['Kevin Flores', 'Josué Amasifuén', 'Yerson Tuanama'];

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule, PageHeaderComponent, EmptyStateComponent, StatusChipComponent],
  templateUrl: './delivery.component.html',
})
export class DeliveryComponent {
  repartidores = REPARTIDORES;
  soloEnCurso = signal(true);

  pedidos = computed(() =>
    this.soloEnCurso() ? this.deliveryService.enCurso() : this.deliveryService.pedidos(),
  );

  constructor(
    private deliveryService: DeliveryService,
    private dialog: MatDialog,
  ) {}

  estadoInfo(pedido: PedidoDelivery) {
    return ESTADOS_DELIVERY[pedido.estado];
  }

  nuevoPedido() {
    const ref = this.dialog.open(DeliveryFormDialogComponent, { width: '560px' });
    ref.afterClosed().subscribe((valor) => {
      if (valor) this.deliveryService.crear({ ...valor, estado: 'pendiente' });
    });
  }

  asignarRepartidor(pedido: PedidoDelivery, repartidor: string) {
    this.deliveryService.actualizar(pedido.id, { repartidor, estado: 'en-camino' });
  }

  cambiarEstado(pedido: PedidoDelivery, estado: EstadoDelivery) {
    this.deliveryService.actualizar(pedido.id, { estado });
  }
}
