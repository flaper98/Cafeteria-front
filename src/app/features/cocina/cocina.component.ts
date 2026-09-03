import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ESTACIONES, Estacion, EstadoItemPedido, ItemPedido, Pedido } from '../../core/models';
import { PedidosService } from '../../core/services/pedidos.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

interface TarjetaCocina {
  pedido: Pedido;
  item: ItemPedido;
}

@Component({
  selector: 'app-cocina',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, PageHeaderComponent, EmptyStateComponent],
  templateUrl: './cocina.component.html',
  styleUrl: './cocina.component.scss',
})
export class CocinaComponent {
  estaciones = ESTACIONES;
  estacionActiva = signal<Estacion | 'todas'>('todas');

  private tarjetas = computed<TarjetaCocina[]>(() => {
    const pedidos = this.pedidosService.activos().filter((p) => p.estado !== 'por-cobrar');
    const estacion = this.estacionActiva();
    const tarjetas: TarjetaCocina[] = [];
    for (const pedido of pedidos) {
      for (const item of pedido.items) {
        if (item.estado === 'entregado') continue;
        if (estacion !== 'todas' && item.estacion !== estacion) continue;
        tarjetas.push({ pedido, item });
      }
    }
    return tarjetas.sort((a, b) => (a.pedido.creadoEn < b.pedido.creadoEn ? -1 : 1));
  });

  pendientes = computed(() => this.tarjetas().filter((t) => t.item.estado === 'pendiente'));
  enPreparacion = computed(() => this.tarjetas().filter((t) => t.item.estado === 'en-preparacion'));
  listos = computed(() => this.tarjetas().filter((t) => t.item.estado === 'listo'));

  constructor(private pedidosService: PedidosService) {}

  referenciaPedido(pedido: Pedido): string {
    if (pedido.numeroMesa) return `Mesa ${pedido.numeroMesa}`;
    return pedido.canal === 'delivery' ? 'Delivery' : 'Para llevar';
  }

  tiempoEspera(pedido: Pedido): string {
    const minutos = Math.floor((Date.now() - new Date(pedido.creadoEn).getTime()) / 60000);
    return `${minutos} min`;
  }

  avanzar(pedido: Pedido, item: ItemPedido, siguiente: EstadoItemPedido) {
    this.pedidosService.cambiarEstadoItem(pedido.id, item.id, siguiente);
    if (siguiente === 'listo' && pedido.estado === 'en-cocina') {
      const quedanPendientes = pedido.items.some((it) => it.id !== item.id && it.estado !== 'listo' && it.estado !== 'entregado');
      if (!quedanPendientes) this.pedidosService.cambiarEstadoPedido(pedido.id, 'servido');
    }
  }
}
