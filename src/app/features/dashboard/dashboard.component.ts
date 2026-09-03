import { Component, computed } from '@angular/core';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartConfiguration,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
);
import { CajaService } from '../../core/services/caja.service';
import { InventarioService } from '../../core/services/inventario.service';
import { MesasService } from '../../core/services/mesas.service';
import { PedidosService } from '../../core/services/pedidos.service';
import { ProductosService } from '../../core/services/productos.service';
import { MEDIOS_PAGO, Pedido } from '../../core/models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';

const BRAND = {
  linea: '#1f4d33',
  areaWash: 'rgba(31, 77, 51, 0.10)',
  barra: '#3f8a5c',
  barraHover: '#2f6b45',
  grid: '#e1e0d9',
  texto: '#898781',
  textoSecundario: '#52514e',
};

function inicioDia(fecha: Date): string {
  const d = new Date(fecha);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function claveDia(iso: string): string {
  return iso.slice(0, 10);
}

const CHART_BASE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#241c12',
      padding: 10,
      cornerRadius: 8,
      titleFont: { size: 12 },
      bodyFont: { size: 12 },
    },
  },
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective, PageHeaderComponent, StatCardComponent, EmptyStateComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  mediosPago = MEDIOS_PAGO;

  private cerrados = computed(() => this.pedidosService.cerrados());

  private cerradosHoy = computed(() => {
    const hoy = inicioDia(new Date());
    return this.cerrados().filter((p) => claveDia(p.creadoEn) === hoy);
  });

  private cerradosAyer = computed(() => {
    const ayer = inicioDia(new Date(Date.now() - 86400000));
    return this.cerrados().filter((p) => claveDia(p.creadoEn) === ayer);
  });

  private ultimos7Dias = computed(() => {
    const limite = Date.now() - 7 * 86400000;
    return this.cerrados().filter((p) => new Date(p.creadoEn).getTime() >= limite);
  });

  private totalPedido(pedido: Pedido) {
    return this.pedidosService.totalPedido(pedido);
  }

  ventasHoy = computed(() => this.cerradosHoy().reduce((acc, p) => acc + this.totalPedido(p), 0));
  ventasAyer = computed(() => this.cerradosAyer().reduce((acc, p) => acc + this.totalPedido(p), 0));

  variacionVsAyer = computed(() => {
    const ayer = this.ventasAyer();
    if (ayer === 0) return 0;
    return ((this.ventasHoy() - ayer) / ayer) * 100;
  });

  ticketPromedioHoy = computed(() => {
    const pedidos = this.cerradosHoy();
    return pedidos.length > 0 ? this.ventasHoy() / pedidos.length : 0;
  });

  mesasOcupadas = computed(() => this.mesasService.ocupadas().length);
  totalMesas = computed(() => this.mesasService.mesas().length);
  pedidosEnCocina = computed(() => this.pedidosService.activos().filter((p) => p.estado === 'en-cocina').length);
  insumosBajoMinimo = this.inventarioService.bajoMinimo;
  mesasPorCobrar = computed(() => this.mesasService.mesas().filter((m) => m.estado === 'por-cobrar'));

  constructor(
    private pedidosService: PedidosService,
    private mesasService: MesasService,
    private productosService: ProductosService,
    private inventarioService: InventarioService,
    private cajaService: CajaService,
  ) {}

  lineOptions: ChartConfiguration<'line'>['options'] = {
    ...CHART_BASE_OPTIONS,
    scales: {
      x: { grid: { display: false }, ticks: { color: BRAND.texto, font: { size: 11 } } },
      y: {
        beginAtZero: true,
        grid: { color: BRAND.grid },
        ticks: { color: BRAND.texto, font: { size: 11 }, callback: (v) => 'S/ ' + v },
      },
    },
  };

  ventas7DiasData = computed<ChartConfiguration<'line'>['data']>(() => {
    const dias: { clave: string; etiqueta: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date(Date.now() - i * 86400000);
      dias.push({
        clave: inicioDia(fecha),
        etiqueta: fecha.toLocaleDateString('es-PE', { weekday: 'short' }).replace('.', ''),
      });
    }
    const totales = dias.map(
      (d) => this.cerrados().filter((p) => claveDia(p.creadoEn) === d.clave).reduce((acc, p) => acc + this.totalPedido(p), 0),
    );
    return {
      labels: dias.map((d) => d.etiqueta),
      datasets: [
        {
          data: totales,
          borderColor: BRAND.linea,
          backgroundColor: BRAND.areaWash,
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: BRAND.linea,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
      ],
    };
  });

  barOptionsHorizontal: ChartConfiguration<'bar'>['options'] = {
    ...CHART_BASE_OPTIONS,
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: BRAND.grid },
        ticks: { color: BRAND.texto, font: { size: 11 }, callback: (v) => 'S/ ' + v },
      },
      y: { grid: { display: false }, ticks: { color: BRAND.textoSecundario, font: { size: 11 } } },
    },
  };

  ventasPorCategoriaData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const totalesPorCategoria = new Map<string, number>();
    for (const pedido of this.ultimos7Dias()) {
      for (const item of pedido.items) {
        const producto = this.productosService.getById(item.productoId);
        if (!producto) continue;
        const monto = item.cantidad * item.precioUnitario;
        totalesPorCategoria.set(producto.categoriaId, (totalesPorCategoria.get(producto.categoriaId) ?? 0) + monto);
      }
    }
    const filas = [...totalesPorCategoria.entries()]
      .map(([categoriaId, total]) => ({ nombre: this.productosService.nombreCategoria(categoriaId), total }))
      .sort((a, b) => b.total - a.total);

    return {
      labels: filas.map((f) => f.nombre),
      datasets: [
        {
          data: filas.map((f) => Math.round(f.total * 100) / 100),
          backgroundColor: BRAND.barra,
          hoverBackgroundColor: BRAND.barraHover,
          borderRadius: 4,
          borderSkipped: false,
          maxBarThickness: 22,
        },
      ],
    };
  });

  ventasPorMedioPagoData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const totales = new Map<string, number>();
    for (const pedido of this.ultimos7Dias()) {
      if (!pedido.medioPago) continue;
      totales.set(pedido.medioPago, (totales.get(pedido.medioPago) ?? 0) + this.totalPedido(pedido));
    }
    const filas = this.mediosPago
      .map((m) => ({ nombre: m.label, total: totales.get(m.value) ?? 0 }))
      .sort((a, b) => b.total - a.total);

    return {
      labels: filas.map((f) => f.nombre),
      datasets: [
        {
          data: filas.map((f) => Math.round(f.total * 100) / 100),
          backgroundColor: BRAND.barra,
          hoverBackgroundColor: BRAND.barraHover,
          borderRadius: 4,
          borderSkipped: false,
          maxBarThickness: 22,
        },
      ],
    };
  });

  topPlatosData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const cantidades = new Map<string, number>();
    for (const pedido of this.ultimos7Dias()) {
      for (const item of pedido.items) {
        cantidades.set(item.nombreProducto, (cantidades.get(item.nombreProducto) ?? 0) + item.cantidad);
      }
    }
    const filas = [...cantidades.entries()]
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 6);

    return {
      labels: filas.map((f) => f.nombre),
      datasets: [
        {
          data: filas.map((f) => f.cantidad),
          backgroundColor: BRAND.barra,
          hoverBackgroundColor: BRAND.barraHover,
          borderRadius: 4,
          borderSkipped: false,
          maxBarThickness: 22,
        },
      ],
    };
  });

  topPlatosOptions: ChartConfiguration<'bar'>['options'] = {
    ...CHART_BASE_OPTIONS,
    indexAxis: 'y' as const,
    scales: {
      x: { beginAtZero: true, grid: { color: BRAND.grid }, ticks: { color: BRAND.texto, font: { size: 11 }, precision: 0 } },
      y: { grid: { display: false }, ticks: { color: BRAND.textoSecundario, font: { size: 11 } } },
    },
  };

  turnoAbierto = this.cajaService.turnoAbierto;
}
