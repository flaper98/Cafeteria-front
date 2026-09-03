import { DatePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MEDIOS_PAGO } from '../../core/models';
import { AuthService } from '../../core/services/auth.service';
import { CajaService } from '../../core/services/caja.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { CierreDialogComponent } from './cierre-dialog.component';
import { MovimientoDialogComponent } from './movimiento-dialog.component';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [DatePipe, MatButtonModule, MatDialogModule, MatIconModule, PageHeaderComponent],
  templateUrl: './caja.component.html',
})
export class CajaComponent {
  mediosPago = MEDIOS_PAGO;
  montoApertura = signal(200);

  turno = this.cajaService.turnoAbierto;
  historial = computed(() => this.cajaService.turnos().filter((t) => t.estado === 'cerrado'));

  movimientos = computed(() => {
    const turno = this.turno();
    return turno ? this.cajaService.movimientosDe(turno.id)() : [];
  });

  resumen = computed(() => {
    const turno = this.turno();
    return turno ? this.cajaService.resumenTurno(turno) : null;
  });

  constructor(
    private cajaService: CajaService,
    private auth: AuthService,
    private dialog: MatDialog,
  ) {}

  abrirTurno() {
    const usuario = this.auth.currentUser();
    if (!usuario) return;
    this.cajaService.abrirTurno(usuario.id, usuario.nombres, this.montoApertura());
  }

  registrarMovimiento(tipo: 'ingreso' | 'egreso') {
    const turno = this.turno();
    if (!turno) return;
    const ref = this.dialog.open(MovimientoDialogComponent, { width: '420px', data: { tipoInicial: tipo } });
    ref.afterClosed().subscribe((valor) => {
      if (!valor) return;
      this.cajaService.registrarMovimiento({ turnoId: turno.id, ...valor });
    });
  }

  cerrarTurno() {
    const turno = this.turno();
    const resumen = this.resumen();
    if (!turno || !resumen) return;
    const ref = this.dialog.open(CierreDialogComponent, {
      width: '420px',
      data: { esperado: resumen.esperadoEfectivo },
    });
    ref.afterClosed().subscribe((montoContado) => {
      if (montoContado === undefined || montoContado === null) return;
      this.cajaService.cerrarTurno(turno.id, montoContado);
    });
  }

  iconoMedio(medio?: string) {
    return this.mediosPago.find((m) => m.value === medio)?.icon ?? 'payments';
  }
}
