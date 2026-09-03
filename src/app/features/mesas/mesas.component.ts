import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StatusChipComponent } from '../../shared/components/status-chip/status-chip.component';
import { ESTADOS_MESA, Mesa } from '../../core/models';
import { MesasService } from '../../core/services/mesas.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MesaFormDialogComponent } from './mesa-form-dialog.component';
import { MesaDetalleDialogComponent } from './mesa-detalle-dialog.component';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule, MatTooltipModule, StatusChipComponent, PageHeaderComponent],
  templateUrl: './mesas.component.html',
})
export class MesasComponent {
  zonaSeleccionada = signal<string | 'todas'>('todas');
  zonas = this.mesasService.zonas;

  mesasFiltradas = computed(() => {
    const zona = this.zonaSeleccionada();
    return [...this.mesasService.mesas()]
      .filter((m) => zona === 'todas' || m.zona === zona)
      .sort((a, b) => a.numero - b.numero);
  });

  resumen = computed(() => {
    const mesas = this.mesasService.mesas();
    return {
      libres: mesas.filter((m) => m.estado === 'libre').length,
      ocupadas: mesas.filter((m) => m.estado === 'ocupada').length,
      porCobrar: mesas.filter((m) => m.estado === 'por-cobrar').length,
      reservadas: mesas.filter((m) => m.estado === 'reservada').length,
    };
  });

  constructor(
    private mesasService: MesasService,
    private dialog: MatDialog,
  ) {}

  estadoInfo(mesa: Mesa) {
    return ESTADOS_MESA[mesa.estado];
  }

  tiempoOcupada(mesa: Mesa): string {
    if (!mesa.horaOcupacion) return '';
    const minutos = Math.floor((Date.now() - new Date(mesa.horaOcupacion).getTime()) / 60000);
    if (minutos < 60) return `${minutos} min`;
    return `${Math.floor(minutos / 60)}h ${minutos % 60}min`;
  }

  abrirDetalle(mesa: Mesa) {
    this.dialog.open(MesaDetalleDialogComponent, { width: '460px', data: { mesa } });
  }

  nuevaMesa() {
    const ref = this.dialog.open(MesaFormDialogComponent, { width: '420px', data: { zonas: this.zonas() } });
    ref.afterClosed().subscribe((valor) => {
      if (valor) this.mesasService.crear({ ...valor, estado: 'libre' });
    });
  }
}
