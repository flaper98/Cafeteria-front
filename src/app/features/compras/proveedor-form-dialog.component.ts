import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Proveedor } from '../../core/models';

@Component({
  selector: 'app-proveedor-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>{{ data.proveedor ? 'Editar proveedor' : 'Nuevo proveedor' }}</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-dialog-content class="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Razón social / Nombre</mat-label>
          <input matInput formControlName="nombre" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Persona de contacto</mat-label>
          <input matInput formControlName="contacto" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="telefono" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>RUC (opcional)</mat-label>
          <input matInput formControlName="ruc" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Productos que provee</mat-label>
          <input matInput formControlName="productos" />
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </mat-dialog-actions>
    </form>
  `,
})
export class ProveedorFormDialogComponent {
  form = this.fb.nonNullable.group({
    nombre: [this.data.proveedor?.nombre ?? '', Validators.required],
    contacto: [this.data.proveedor?.contacto ?? '', Validators.required],
    telefono: [this.data.proveedor?.telefono ?? '', Validators.required],
    ruc: [this.data.proveedor?.ruc ?? ''],
    productos: [this.data.proveedor?.productos ?? '', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProveedorFormDialogComponent, Omit<Proveedor, 'id'>>,
    @Inject(MAT_DIALOG_DATA) public data: { proveedor?: Proveedor },
  ) {}

  guardar() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.getRawValue());
  }
}
