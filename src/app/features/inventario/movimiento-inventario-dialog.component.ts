import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ItemInventario, TIPOS_MOVIMIENTO_INVENTARIO, TipoMovimientoInventario } from '../../core/models';

export interface MovimientoInventarioResult {
  tipo: TipoMovimientoInventario;
  cantidad: number;
  motivo: string;
}

@Component({
  selector: 'app-movimiento-inventario-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>Movimiento · {{ data.item.nombre }}</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-dialog-content class="flex flex-col gap-1">
        <p class="text-sm text-stone-500 mb-2">
          Stock actual: <strong>{{ data.item.stockActual }} {{ data.item.unidad }}</strong>
        </p>
        <mat-form-field appearance="outline">
          <mat-label>Tipo de movimiento</mat-label>
          <mat-select formControlName="tipo">
            @for (tipo of tipos; track tipo.value) {
              <mat-option [value]="tipo.value">{{ tipo.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Cantidad ({{ data.item.unidad }})</mat-label>
          <input matInput type="number" step="0.1" formControlName="cantidad" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Motivo</mat-label>
          <input matInput formControlName="motivo" placeholder="Ej. Compra a proveedor" />
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Registrar</button>
      </mat-dialog-actions>
    </form>
  `,
})
export class MovimientoInventarioDialogComponent {
  tipos = TIPOS_MOVIMIENTO_INVENTARIO;

  form = this.fb.nonNullable.group({
    tipo: ['entrada' as TipoMovimientoInventario, Validators.required],
    cantidad: [0, [Validators.required, Validators.min(0.1)]],
    motivo: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MovimientoInventarioDialogComponent, MovimientoInventarioResult>,
    @Inject(MAT_DIALOG_DATA) public data: { item: ItemInventario },
  ) {}

  guardar() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.getRawValue());
  }
}
