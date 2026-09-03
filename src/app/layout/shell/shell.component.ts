import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, computed, effect, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NAV_SECTIONS } from './nav-items';
import { ROLES } from '../../core/models';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private esMovil = toSignal(this.breakpointObserver.observe('(max-width: 900px)'), {
    initialValue: { matches: false, breakpoints: {} },
  });

  modoSidenav = computed<'side' | 'over'>(() => (this.esMovil().matches ? 'over' : 'side'));
  sidenavAbierto = signal(!this.esMovil().matches);

  usuario = this.auth.currentUser;
  rolLabel = computed(() => ROLES.find((r) => r.value === this.usuario()?.rol)?.label ?? '');
  secciones = computed(() => {
    const rol = this.usuario()?.rol;
    if (!rol) return [];
    return NAV_SECTIONS.map((seccion) => ({
      ...seccion,
      items: seccion.items.filter((item) => item.roles.includes(rol)),
    })).filter((seccion) => seccion.items.length > 0);
  });

  horaActual = signal(this.formatearHora());

  constructor(
    private breakpointObserver: BreakpointObserver,
    private auth: AuthService,
    private router: Router,
  ) {
    setInterval(() => this.horaActual.set(this.formatearHora()), 30000);
    effect(() => this.sidenavAbierto.set(this.modoSidenav() === 'side'));
  }

  alternarSidenav() {
    this.sidenavAbierto.update((v) => !v);
  }

  cerrarSiEsMovil() {
    if (this.modoSidenav() === 'over') this.sidenavAbierto.set(false);
  }

  cerrarSesion() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private formatearHora() {
    return new Date().toLocaleString('es-PE', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
