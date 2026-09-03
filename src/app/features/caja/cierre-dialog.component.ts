import { Component, Inject, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cierre-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Cerrar turno de caja</h2>
    <mat-dialog-content>
      <p class="text-sm text-stone-500">Efectivo esperado en caja</p>
      <p class="text-2xl font-semibold mb-4">S/ {{ data.esperado.toFixed(2) }}</p>

      <label class="text-sm text-stone-500">Monto contado en caja (S/)</label>
      <input
        type="number"
        step="0.10"
        class="w-full border border-stone-300 rounded-lg px-3 py-2 mt-1"
        [ngModel]="montoContadoSignal()"
        (ngModelChange)="montoContadoSignal.set(+$event || 0)"
      />

      <div class="mt-4 p-3 rounded-lg" [class]="diferencia() === 0 ? 'bg-emerald-50' : 'bg-amber-50'">
        <p class="text-sm m-0" [class]="diferencia() === 0 ? 'text-emerald-700' : 'text-amber-700'">
          Diferencia: S/ {{ diferencia().toFixed(2) }}
          {{ diferencia() === 0 ? '(caja cuadrada)' : diferencia() > 0 ? '(sobrante)' : '(faltante)' }}
        </p>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-flat-button color="primary" (click)="dialogRef.close(montoContadoSignal())">Confirmar cierre</button>
    </mat-dialog-actions>
  `,
})
export class CierreDialogComponent {
  montoContadoSignal = signal(this.data.esperado);

  diferencia = computed(() => this.montoContadoSignal() - this.data.esperado);

  constructor(
    public dialogRef: MatDialogRef<CierreDialogComponent, number>,
    @Inject(MAT_DIALOG_DATA) public data: { esperado: number },
  ) {}
}
