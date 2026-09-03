import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ROLES, Rol, Usuario } from '../../core/models';
import { UsuariosService } from '../../core/services/usuarios.service';
import { AuthService } from '../../core/services/auth.service';
import { NAV_SECTIONS } from '../../layout/shell/nav-items';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { UsuarioFormDialogComponent } from './usuario-form-dialog.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [DatePipe, MatButtonModule, MatDialogModule, MatIconModule, MatSlideToggleModule, MatTableModule, MatTooltipModule, PageHeaderComponent],
  templateUrl: './usuarios.component.html',
})
export class UsuariosComponent {
  columnas = ['nombre', 'usuario', 'rol', 'ultimoAcceso', 'activo', 'acciones'];
  roles = ROLES;
  modulos = NAV_SECTIONS.flatMap((s) => s.items);

  usuarios = this.usuariosService.usuarios;

  constructor(
    private usuariosService: UsuariosService,
    private auth: AuthService,
    private dialog: MatDialog,
  ) {}

  rolLabel(rol: string) {
    return this.roles.find((r) => r.value === rol)?.label ?? rol;
  }

  esUsuarioActual(usuario: Usuario) {
    return this.auth.currentUser()?.id === usuario.id;
  }

  nuevoUsuario() {
    const ref = this.dialog.open(UsuarioFormDialogComponent, { width: '520px', data: {} });
    ref.afterClosed().subscribe((valor) => {
      if (valor) this.usuariosService.crear(valor);
    });
  }

  editarUsuario(usuario: Usuario) {
    const ref = this.dialog.open(UsuarioFormDialogComponent, { width: '520px', data: { usuario } });
    ref.afterClosed().subscribe((valor) => {
      if (valor) this.usuariosService.actualizar(usuario.id, valor);
    });
  }

  alternarActivo(usuario: Usuario) {
    this.usuariosService.actualizar(usuario.id, { activo: !usuario.activo });
  }

  eliminarUsuario(usuario: Usuario) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Eliminar usuario',
        message: `¿Deseas eliminar a ${usuario.nombres}? No podrá volver a iniciar sesión.`,
        confirmLabel: 'Eliminar',
        danger: true,
      },
    });
    ref.afterClosed().subscribe((ok) => {
      if (ok) this.usuariosService.eliminar(usuario.id);
    });
  }

  tienePermiso(modulo: (typeof this.modulos)[number], rol: Rol) {
    return modulo.roles.includes(rol);
  }
}
