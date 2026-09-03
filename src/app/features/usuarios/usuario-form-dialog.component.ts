import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ROLES, Usuario } from '../../core/models';

export interface UsuarioFormDialogData {
  usuario?: Usuario;
}

@Component({
  selector: 'app-usuario-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule],
  template: `
    <h2 mat-dialog-title>{{ data.usuario ? 'Editar usuario' : 'Nuevo usuario' }}</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-dialog-content class="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Nombres completos</mat-label>
          <input matInput formControlName="nombres" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Usuario</mat-label>
          <input matInput formControlName="usuario" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Contraseña</mat-label>
          <input matInput type="text" formControlName="password" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Rol</mat-label>
          <mat-select formControlName="rol">
            @for (rol of roles; track rol.value) {
              <mat-option [value]="rol.value">{{ rol.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-checkbox formControlName="activo" class="sm:col-span-2">Usuario activo</mat-checkbox>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </mat-dialog-actions>
    </form>
  `,
})
export class UsuarioFormDialogComponent {
  roles = ROLES;

  form = this.fb.nonNullable.group({
    nombres: [this.data.usuario?.nombres ?? '', Validators.required],
    usuario: [this.data.usuario?.usuario ?? '', Validators.required],
    password: [this.data.usuario?.password ?? '1234', Validators.required],
    rol: [this.data.usuario?.rol ?? 'mozo', Validators.required],
    activo: [this.data.usuario?.activo ?? true],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UsuarioFormDialogComponent, Omit<Usuario, 'id'>>,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioFormDialogData,
  ) {}

  guardar() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.getRawValue());
  }
}
