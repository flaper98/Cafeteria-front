import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ItemInventario } from '../../core/models';

@Component({
  selector: 'app-item-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>{{ data.item ? 'Editar insumo' : 'Nuevo insumo' }}</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-dialog-content class="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Categoría</mat-label>
          <input matInput formControlName="categoria" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Unidad</mat-label>
          <input matInput formControlName="unidad" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Stock actual</mat-label>
          <input matInput type="number" step="0.1" formControlName="stockActual" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Stock mínimo</mat-label>
          <input matInput type="number" step="0.1" formControlName="stockMinimo" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Costo unitario (S/)</mat-label>
          <input matInput type="number" step="0.01" formControlName="costoUnitario" />
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </mat-dialog-actions>
    </form>
  `,
})
export class ItemFormDialogComponent {
  form = this.fb.nonNullable.group({
    nombre: [this.data.item?.nombre ?? '', Validators.required],
    categoria: [this.data.item?.categoria ?? '', Validators.required],
    unidad: [this.data.item?.unidad ?? 'kg', Validators.required],
    stockActual: [this.data.item?.stockActual ?? 0, [Validators.required, Validators.min(0)]],
    stockMinimo: [this.data.item?.stockMinimo ?? 0, [Validators.required, Validators.min(0)]],
    costoUnitario: [this.data.item?.costoUnitario ?? 0, [Validators.required, Validators.min(0)]],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ItemFormDialogComponent, Omit<ItemInventario, 'id'>>,
    @Inject(MAT_DIALOG_DATA) public data: { item?: ItemInventario },
  ) {}

  guardar() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.getRawValue());
  }
}
