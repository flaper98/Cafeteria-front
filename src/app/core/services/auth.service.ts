import { Injectable, computed, signal } from '@angular/core';
import { Usuario } from '../models';
import { UsuariosService } from './usuarios.service';

const STORAGE_KEY = 'tirol-lacteos.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserId = signal<string | null>(this.leerSesionGuardada());

  currentUser = computed<Usuario | null>(() => {
    const id = this.currentUserId();
    return id ? (this.usuariosService.getById(id) ?? null) : null;
  });

  isAuthenticated = computed(() => this.currentUser() !== null);

  constructor(private usuariosService: UsuariosService) {}

  login(usuario: string, password: string): boolean {
    const user = this.usuariosService.findByCredenciales(usuario, password);
    if (!user) return false;
    this.currentUserId.set(user.id);
    this.usuariosService.registrarAcceso(user.id);
    try {
      sessionStorage.setItem(STORAGE_KEY, user.id);
    } catch {
      /* almacenamiento no disponible, la sesión sigue en memoria */
    }
    return true;
  }

  logout() {
    this.currentUserId.set(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* almacenamiento no disponible */
    }
  }

  private leerSesionGuardada(): string | null {
    try {
      return sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }
}
