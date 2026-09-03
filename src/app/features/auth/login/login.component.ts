import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';
import { rutaInicialPara } from '../../../layout/shell/nav-items';

interface AccesoDemo {
  usuario: string;
  rol: string;
  icon: string;
}

const ACCESOS_DEMO: AccesoDemo[] = [
  { usuario: 'admin', rol: 'Administrador', icon: 'admin_panel_settings' },
  { usuario: 'cajero1', rol: 'Cajero', icon: 'point_of_sale' },
  { usuario: 'mozo1', rol: 'Mozo', icon: 'room_service' },
  { usuario: 'cocina1', rol: 'Cocina', icon: 'soup_kitchen' },
];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  accesosDemo = ACCESOS_DEMO;
  ocultarPassword = signal(true);
  error = signal<string | null>(null);
  cargando = signal(false);

  form = this.fb.nonNullable.group({
    usuario: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {}

  usarAcceso(usuario: string) {
    this.form.setValue({ usuario, password: '1234' });
    this.ingresar();
  }

  ingresar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando.set(true);
    this.error.set(null);
    const { usuario, password } = this.form.getRawValue();

    setTimeout(() => {
      const exito = this.auth.login(usuario, password);
      this.cargando.set(false);
      if (!exito) {
        this.error.set('Usuario o contraseña incorrectos.');
        return;
      }
      const rol = this.auth.currentUser()!.rol;
      this.router.navigateByUrl(rutaInicialPara(rol));
    }, 300);
  }
}
