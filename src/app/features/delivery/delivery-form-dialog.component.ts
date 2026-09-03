import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PedidoDelivery } from '../../core/models';

@Component({
  selector: 'app-delivery-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>Nuevo pedido delivery</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-dialog-content class="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Cliente</mat-label>
          <input matInput formControlName="clienteNombre" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="telefono" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Costo de envío (S/)</mat-label>
          <input matInput type="number" step="0.5" formControlName="costoEnvio" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Dirección</mat-label>
          <input matInput formControlName="direccion" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Referencia (opcional)</mat-label>
          <input matInput formControlName="referencia" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Total del pedido (S/)</mat-label>
          <input matInput type="number" step="0.5" formControlName="total" />
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Crear pedido</button>
      </mat-dialog-actions>
    </form>
  `,
})
export class DeliveryFormDialogComponent {
  form = this.fb.nonNullable.group({
    clienteNombre: ['', Validators.required],
    telefono: ['', Validators.required],
    direccion: ['', Validators.required],
    referencia: [''],
    costoEnvio: [5, [Validators.required, Validators.min(0)]],
    total: [0, [Validators.required, Validators.min(1)]],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DeliveryFormDialogComponent, Omit<PedidoDelivery, 'id' | 'creadoEn' | 'estado' | 'repartidor'>>,
  ) {}

  guardar() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.getRawValue());
  }
}
