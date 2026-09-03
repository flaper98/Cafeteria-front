import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StatusChipComponent } from '../../shared/components/status-chip/status-chip.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ESTADOS_ITEM, ESTADOS_PEDIDO, EstadoPedido, Pedido } from '../../core/models';
import { MesasService } from '../../core/services/mesas.service';
import { PedidosService } from '../../core/services/pedidos.service';

const FILTROS: { value: EstadoPedido | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'abierto', label: 'Abierto' },
  { value: 'en-cocina', label: 'En cocina' },
  { value: 'servido', label: 'Servido' },
  { value: 'por-cobrar', label: 'Por cobrar' },
];

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, StatusChipComponent, PageHeaderComponent, EmptyStateComponent],
  templateUrl: './pedidos.component.html',
})
export class PedidosComponent {
  filtros = FILTROS;
  filtroActivo = signal<EstadoPedido | 'todos'>('todos');

  pedidosFiltrados = computed(() => {
    const filtro = this.filtroActivo();
    return this.pedidosService
      .activos()
      .filter((p) => filtro === 'todos' || p.estado === filtro);
  });

  constructor(
    private pedidosService: PedidosService,
    private mesasService: MesasService,
    private router: Router,
  ) {}

  estadoPedidoInfo(pedido: Pedido) {
    return ESTADOS_PEDIDO[pedido.estado];
  }

  estadoItemInfo(estado: keyof typeof ESTADOS_ITEM) {
    return ESTADOS_ITEM[estado];
  }

  total(pedido: Pedido) {
    return this.pedidosService.totalPedido(pedido);
  }

  tiempoTranscurrido(pedido: Pedido): string {
    const minutos = Math.floor((Date.now() - new Date(pedido.creadoEn).getTime()) / 60000);
    if (minutos < 60) return `hace ${minutos} min`;
    return `hace ${Math.floor(minutos / 60)}h ${minutos % 60}min`;
  }

  entregarItem(pedido: Pedido, itemId: string) {
    this.pedidosService.cambiarEstadoItem(pedido.id, itemId, 'entregado');
    const todosEntregados = pedido.items.every((it) => it.id === itemId || it.estado === 'entregado');
    if (todosEntregados) this.pedidosService.cambiarEstadoPedido(pedido.id, 'servido');
  }

  marcarPorCobrar(pedido: Pedido) {
    this.pedidosService.cambiarEstadoPedido(pedido.id, 'por-cobrar');
  }

  irAlPos(pedido: Pedido) {
    if (pedido.mesaId) {
      this.router.navigate(['/pos'], { queryParams: { mesa: pedido.mesaId } });
    } else {
      this.router.navigate(['/pos']);
    }
  }

  anularPedido(pedido: Pedido) {
    this.pedidosService.cambiarEstadoPedido(pedido.id, 'anulado');
    if (pedido.mesaId) this.mesasService.liberar(pedido.mesaId);
  }
}
