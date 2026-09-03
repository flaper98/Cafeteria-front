import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Mesa } from '../../core/models';

export interface MesaFormDialogData {
  zonas: string[];
  mesa?: Mesa;
}

@Component({
  selector: 'app-mesa-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>{{ data.mesa ? 'Editar mesa' : 'Nueva mesa' }}</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-dialog-content class="grid grid-cols-2 gap-x-4">
        <mat-form-field appearance="outline">
          <mat-label>Número de mesa</mat-label>
          <input matInput type="number" formControlName="numero" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Capacidad (personas)</mat-label>
          <input matInput type="number" formControlName="capacidad" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="col-span-2">
          <mat-label>Zona</mat-label>
          <input matInput formControlName="zona" list="zonas-lista" />
          <datalist id="zonas-lista">
            @for (z of data.zonas; track z) {
              <option [value]="z"></option>
            }
          </datalist>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Guardar</button>
      </mat-dialog-actions>
    </form>
  `,
})
export class MesaFormDialogComponent {
  form = this.fb.nonNullable.group({
    numero: [this.data.mesa?.numero ?? 1, [Validators.required, Validators.min(1)]],
    capacidad: [this.data.mesa?.capacidad ?? 4, [Validators.required, Validators.min(1)]],
    zona: [this.data.mesa?.zona ?? this.data.zonas[0] ?? 'Salón Principal', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MesaFormDialogComponent, { numero: number; capacidad: number; zona: string }>,
    @Inject(MAT_DIALOG_DATA) public data: MesaFormDialogData,
  ) {}

  guardar() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.getRawValue());
  }
}
