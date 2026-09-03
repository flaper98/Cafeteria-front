import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Cliente } from '../../core/models';

@Component({
  selector: 'app-cliente-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>{{ data.cliente ? 'Editar cliente' : 'Nuevo cliente' }}</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-dialog-content class="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Nombres</mat-label>
          <input matInput formControlName="nombres" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="telefono" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Email (opcional)</mat-label>
          <input matInput formControlName="email" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Dirección (opcional)</mat-label>
          <input matInput formControlName="direccion" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Preferencias</mat-label>
          <input matInput formControlName="preferencias" placeholder="Ej. Cappuccino sin azúcar" />
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </mat-dialog-actions>
    </form>
  `,
})
export class ClienteFormDialogComponent {
  form = this.fb.nonNullable.group({
    nombres: [this.data.cliente?.nombres ?? '', Validators.required],
    telefono: [this.data.cliente?.telefono ?? '', Validators.required],
    email: [this.data.cliente?.email ?? ''],
    direccion: [this.data.cliente?.direccion ?? ''],
    preferencias: [this.data.cliente?.preferencias ?? ''],
    visitas: [this.data.cliente?.visitas ?? 0],
    consumoTotal: [this.data.cliente?.consumoTotal ?? 0],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ClienteFormDialogComponent, Omit<Cliente, 'id'>>,
    @Inject(MAT_DIALOG_DATA) public data: { cliente?: Cliente },
  ) {}

  guardar() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.getRawValue());
  }
}
