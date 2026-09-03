import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Categoria, Producto, TIPOS_PRODUCTO } from '../../core/models';

const EMOJIS = ['☕', '🥤', '🥛', '🧀', '🍯', '🥣', '🥐', '🍰', '🍪', '🥪', '🍞', '🍽️', '🥟', '🍮', '🍨'];

export interface ProductoFormDialogData {
  categorias: Categoria[];
  producto?: Producto;
}

@Component({
  selector: 'app-producto-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.producto ? 'Editar producto' : 'Nuevo producto' }}</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-dialog-content class="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Descripción</mat-label>
          <textarea matInput rows="2" formControlName="descripcion"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Categoría</mat-label>
          <mat-select formControlName="categoriaId">
            @for (cat of data.categorias; track cat.id) {
              <mat-option [value]="cat.id">{{ cat.nombre }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tipo</mat-label>
          <mat-select formControlName="tipo">
            @for (tipo of tipos; track tipo.value) {
              <mat-option [value]="tipo.value">{{ tipo.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Precio de venta (S/)</mat-label>
          <input matInput type="number" step="0.10" formControlName="precio" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Costo estimado (S/)</mat-label>
          <input matInput type="number" step="0.10" formControlName="costoEstimado" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Ícono</mat-label>
          <mat-select formControlName="imagenEmoji">
            @for (emoji of emojis; track emoji) {
              <mat-option [value]="emoji">{{ emoji }} </mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-checkbox formControlName="disponible">Disponible en la carta</mat-checkbox>
        <mat-checkbox formControlName="destacado">Destacado en el POS</mat-checkbox>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </mat-dialog-actions>
    </form>
  `,
})
export class ProductoFormDialogComponent {
  tipos = TIPOS_PRODUCTO;
  emojis = EMOJIS;

  form = this.fb.nonNullable.group({
    nombre: [this.data.producto?.nombre ?? '', Validators.required],
    descripcion: [this.data.producto?.descripcion ?? ''],
    categoriaId: [this.data.producto?.categoriaId ?? this.data.categorias[0]?.id ?? '', Validators.required],
    tipo: [this.data.producto?.tipo ?? 'plato', Validators.required],
    precio: [this.data.producto?.precio ?? 0, [Validators.required, Validators.min(0)]],
    costoEstimado: [this.data.producto?.costoEstimado ?? 0, [Validators.required, Validators.min(0)]],
    imagenEmoji: [this.data.producto?.imagenEmoji ?? EMOJIS[0]],
    disponible: [this.data.producto?.disponible ?? true],
    destacado: [this.data.producto?.destacado ?? false],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductoFormDialogComponent, Omit<Producto, 'id'>>,
    @Inject(MAT_DIALOG_DATA) public data: ProductoFormDialogData,
  ) {}

  guardar() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.getRawValue());
  }
}
