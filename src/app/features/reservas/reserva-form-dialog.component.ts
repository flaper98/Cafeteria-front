import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Mesa, Reserva } from '../../core/models';

export interface ReservaFormDialogData {
  mesas: Mesa[];
  reserva?: Reserva;
}

@Component({
  selector: 'app-reserva-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>{{ data.reserva ? 'Editar reserva' : 'Nueva reserva' }}</h2>
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
          <mat-label>N° de personas</mat-label>
          <input matInput type="number" min="1" formControlName="personas" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Fecha</mat-label>
          <input matInput type="date" formControlName="fecha" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Hora</mat-label>
          <input matInput type="time" formControlName="hora" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Mesa (opcional)</mat-label>
          <mat-select formControlName="mesaId">
            <mat-option [value]="null">Sin asignar aún</mat-option>
            @for (mesa of data.mesas; track mesa.id) {
              <mat-option [value]="mesa.id">Mesa {{ mesa.numero }} · {{ mesa.zona }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="sm:col-span-2">
          <mat-label>Observaciones</mat-label>
          <textarea matInput rows="2" formControlName="observaciones"></textarea>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </mat-dialog-actions>
    </form>
  `,
})
export class ReservaFormDialogComponent {
  form = this.fb.nonNullable.group({
    clienteNombre: [this.data.reserva?.clienteNombre ?? '', Validators.required],
    telefono: [this.data.reserva?.telefono ?? '', Validators.required],
    personas: [this.data.reserva?.personas ?? 2, [Validators.required, Validators.min(1)]],
    fecha: [this.data.reserva?.fecha ?? new Date().toISOString().slice(0, 10), Validators.required],
    hora: [this.data.reserva?.hora ?? '13:00', Validators.required],
    mesaId: [this.data.reserva?.mesaId ?? null],
    observaciones: [this.data.reserva?.observaciones ?? ''],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReservaFormDialogComponent, Omit<Reserva, 'id' | 'estado' | 'numeroMesa'>>,
    @Inject(MAT_DIALOG_DATA) public data: ReservaFormDialogData,
  ) {}

  guardar() {
    if (this.form.invalid) return;
    const valor = this.form.getRawValue();
    this.dialogRef.close({ ...valor, mesaId: valor.mesaId ?? undefined });
  }
}
