import { DatePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Cliente } from '../../core/models';
import { ClientesService } from '../../core/services/clientes.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ClienteFormDialogComponent } from './cliente-form-dialog.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [DatePipe, MatButtonModule, MatDialogModule, MatIconModule, MatTableModule, MatTooltipModule, MatFormFieldModule, MatInputModule, PageHeaderComponent, EmptyStateComponent],
  templateUrl: './clientes.component.html',
})
export class ClientesComponent {
  columnas = ['nombre', 'contacto', 'visitas', 'consumo', 'ultimaVisita', 'acciones'];
  busqueda = signal('');

  filtrados = computed(() => {
    const t = this.busqueda().trim().toLowerCase();
    return this.clientesService
      .clientes()
      .filter((c) => !t || c.nombres.toLowerCase().includes(t) || c.telefono.includes(t));
  });

  constructor(
    private clientesService: ClientesService,
    private dialog: MatDialog,
  ) {}

  nuevoCliente() {
    const ref = this.dialog.open(ClienteFormDialogComponent, { width: '520px', data: {} });
    ref.afterClosed().subscribe((valor) => {
      if (valor) this.clientesService.crear(valor);
    });
  }

  editarCliente(cliente: Cliente) {
    const ref = this.dialog.open(ClienteFormDialogComponent, { width: '520px', data: { cliente } });
    ref.afterClosed().subscribe((valor) => {
      if (valor) this.clientesService.actualizar(cliente.id, valor);
    });
  }

  eliminarCliente(cliente: Cliente) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: { title: 'Eliminar cliente', message: `¿Eliminar a "${cliente.nombres}"?`, confirmLabel: 'Eliminar', danger: true },
    });
    ref.afterClosed().subscribe((ok) => {
      if (ok) this.clientesService.eliminar(cliente.id);
    });
  }
}
