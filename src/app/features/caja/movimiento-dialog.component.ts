import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface MovimientoDialogResult {
  tipo: 'ingreso' | 'egreso';
  concepto: string;
  monto: number;
}

@Component({
  selector: 'app-movimiento-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatButtonToggleModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>Registrar movimiento de caja</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-dialog-content class="flex flex-col gap-3">
        <mat-button-toggle-group formControlName="tipo" class="w-full">
          <mat-button-toggle value="ingreso" class="flex-1">Ingreso</mat-button-toggle>
          <mat-button-toggle value="egreso" class="flex-1">Egreso</mat-button-toggle>
        </mat-button-toggle-group>

        <mat-form-field appearance="outline">
          <mat-label>Concepto</mat-label>
          <input matInput formControlName="concepto" placeholder="Ej. Compra de insumos" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Monto (S/)</mat-label>
          <input matInput type="number" step="0.10" min="0.10" formControlName="monto" />
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Registrar</button>
      </mat-dialog-actions>
    </form>
  `,
})
export class MovimientoDialogComponent {
  form = this.fb.nonNullable.group({
    tipo: ['egreso' as 'ingreso' | 'egreso', Validators.required],
    concepto: ['', Validators.required],
    monto: [0, [Validators.required, Validators.min(0.1)]],
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MovimientoDialogComponent, MovimientoDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: { tipoInicial?: 'ingreso' | 'egreso' },
  ) {
    if (data?.tipoInicial) this.form.patchValue({ tipo: data.tipoInicial });
  }

  guardar() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.getRawValue());
  }
}
