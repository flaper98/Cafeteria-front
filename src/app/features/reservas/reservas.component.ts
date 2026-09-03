import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ESTADOS_RESERVA, Reserva } from '../../core/models';
import { MesasService } from '../../core/services/mesas.service';
import { ReservasService } from '../../core/services/reservas.service';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusChipComponent } from '../../shared/components/status-chip/status-chip.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ReservaFormDialogComponent } from './reserva-form-dialog.component';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    PageHeaderComponent,
    EmptyStateComponent,
    StatusChipComponent,
  ],
  templateUrl: './reservas.component.html',
})
export class ReservasComponent {
  columnas = ['cliente', 'fechaHora', 'personas', 'mesa', 'estado', 'acciones'];
  soloProximas = signal(true);

  reservasMostradas = computed(() =>
    this.soloProximas() ? this.reservasService.proximas() : this.reservasService.reservas(),
  );

  constructor(
    private reservasService: ReservasService,
    private mesasService: MesasService,
    private dialog: MatDialog,
  ) {}

  estadoInfo(reserva: Reserva) {
    return ESTADOS_RESERVA[reserva.estado];
  }

  nuevaReserva() {
    const ref = this.dialog.open(ReservaFormDialogComponent, {
      width: '560px',
      data: { mesas: this.mesasService.mesas() },
    });
    ref.afterClosed().subscribe((valor) => {
      if (!valor) return;
      const mesa = valor.mesaId ? this.mesasService.getById(valor.mesaId) : undefined;
      this.reservasService.crear({ ...valor, numeroMesa: mesa?.numero, estado: 'pendiente' });
    });
  }

  editarReserva(reserva: Reserva) {
    const ref = this.dialog.open(ReservaFormDialogComponent, {
      width: '560px',
      data: { mesas: this.mesasService.mesas(), reserva },
    });
    ref.afterClosed().subscribe((valor) => {
      if (!valor) return;
      const mesa = valor.mesaId ? this.mesasService.getById(valor.mesaId) : undefined;
      this.reservasService.actualizar(reserva.id, { ...valor, numeroMesa: mesa?.numero });
    });
  }

  confirmar(reserva: Reserva) {
    this.reservasService.actualizar(reserva.id, { estado: 'confirmada' });
  }

  cancelar(reserva: Reserva) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Cancelar reserva',
        message: `¿Deseas cancelar la reserva de ${reserva.clienteNombre}?`,
        confirmLabel: 'Cancelar reserva',
        danger: true,
      },
    });
    ref.afterClosed().subscribe((ok) => {
      if (ok) this.reservasService.actualizar(reserva.id, { estado: 'cancelada' });
    });
  }
}
