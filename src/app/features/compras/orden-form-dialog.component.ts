import { Component, Inject, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ItemOrdenCompra, Proveedor } from '../../core/models';

export interface OrdenFormResult {
  proveedorId: string;
  items: Omit<ItemOrdenCompra, 'id'>[];
}

@Component({
  selector: 'app-orden-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Nueva orden de compra</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Proveedor</mat-label>
          <mat-select formControlName="proveedorId">
            @for (p of data.proveedores; track p.id) {
              <mat-option [value]="p.id">{{ p.nombre }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <div class="item-form-row header">
          <span>Descripción</span>
          <span>Cant.</span>
          <span>Unidad</span>
          <span>P. Unit.</span>
          <span></span>
        </div>
        @for (linea of lineas(); track linea.id; let i = $index) {
          <div class="item-form-row">
            <input placeholder="Insumo" [value]="linea.descripcion" (input)="actualizar(i, 'descripcion', $any($event.target).value)" />
            <input type="number" [value]="linea.cantidad" (input)="actualizar(i, 'cantidad', +$any($event.target).value)" />
            <input placeholder="kg" [value]="linea.unidad" (input)="actualizar(i, 'unidad', $any($event.target).value)" />
            <input type="number" [value]="linea.precioUnitario" (input)="actualizar(i, 'precioUnitario', +$any($event.target).value)" />
            <button mat-icon-button type="button" (click)="quitarLinea(i)">
              <mat-icon class="!text-base opacity-60">close</mat-icon>
            </button>
          </div>
        }

        <button mat-button type="button" class="!mt-2" (click)="agregarLinea()">
          <mat-icon>add</mat-icon>
          Agregar ítem
        </button>

        <p class="text-right font-semibold mt-3">Total: S/ {{ total().toFixed(2) }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || lineas().length === 0">
          Crear orden
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [
    `
      .item-form-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr auto;
        gap: 0.4rem;
        align-items: center;
        margin-bottom: 0.4rem;

        input {
          border: 1px solid #e7e2d8;
          border-radius: 0.4rem;
          padding: 0.35rem 0.5rem;
          font-size: 0.85rem;
          width: 100%;
        }
      }

      .header {
        font-size: 0.7rem;
        text-transform: uppercase;
        color: #a8a29e;
        font-weight: 600;
      }
    `,
  ],
})
export class OrdenFormDialogComponent {
  form = this.fb.nonNullable.group({
    proveedorId: [this.data.proveedores[0]?.id ?? '', Validators.required],
  });

  lineas = signal<(Omit<ItemOrdenCompra, 'id'> & { id: string })[]>([
    { id: 'l1', descripcion: '', cantidad: 1, unidad: 'kg', precioUnitario: 0 },
  ]);

  total = computed(() => this.lineas().reduce((acc, l) => acc + l.cantidad * l.precioUnitario, 0));

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OrdenFormDialogComponent, OrdenFormResult>,
    @Inject(MAT_DIALOG_DATA) public data: { proveedores: Proveedor[] },
  ) {}

  actualizar(index: number, campo: 'descripcion' | 'cantidad' | 'unidad' | 'precioUnitario', valor: string | number) {
    this.lineas.update((lista) => {
      const copia = [...lista];
      copia[index] = { ...copia[index], [campo]: valor };
      return copia;
    });
  }

  agregarLinea() {
    this.lineas.update((lista) => [
      ...lista,
      { id: `l${lista.length + 1}-${Date.now()}`, descripcion: '', cantidad: 1, unidad: 'kg', precioUnitario: 0 },
    ]);
  }

  quitarLinea(index: number) {
    this.lineas.update((lista) => lista.filter((_, i) => i !== index));
  }

  guardar() {
    if (this.form.invalid || this.lineas().length === 0) return;
    const items = this.lineas()
      .filter((l) => l.descripcion.trim())
      .map(({ id, ...resto }) => resto);
    this.dialogRef.close({ proveedorId: this.form.getRawValue().proveedorId, items });
  }
}
