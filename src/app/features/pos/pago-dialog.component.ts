import { Component, Inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MEDIOS_PAGO, MedioPago } from '../../core/models';

@Component({
  selector: 'app-pago-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Cobrar pedido</h2>
    <mat-dialog-content>
      <p class="text-3xl font-semibold text-center my-2">S/ {{ data.total.toFixed(2) }}</p>
      <p class="text-sm text-stone-500 text-center mb-4">Selecciona el medio de pago</p>
      <div class="grid grid-cols-2 gap-3">
        @for (medio of medios; track medio.value) {
          <button
            type="button"
            class="medio-pago-btn"
            [class.medio-pago-activo]="medioSeleccionado() === medio.value"
            (click)="medioSeleccionado.set(medio.value)"
          >
            <mat-icon>{{ medio.icon }}</mat-icon>
            <span>{{ medio.label }}</span>
          </button>
        }
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button
        mat-flat-button
        color="primary"
        [disabled]="!medioSeleccionado()"
        (click)="dialogRef.close(medioSeleccionado() ?? undefined)"
      >
        Confirmar cobro
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .medio-pago-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.35rem;
        padding: 1rem;
        border: 1.5px solid #e7e2d8;
        border-radius: 0.75rem;
        background: #fff;
        cursor: pointer;
        font-size: 0.85rem;
        color: #44403c;
      }
      .medio-pago-activo {
        border-color: var(--brand-forest);
        background: #eaf3ec;
        color: var(--brand-forest);
      }
    `,
  ],
})
export class PagoDialogComponent {
  medios = MEDIOS_PAGO;
  medioSeleccionado = signal<MedioPago | null>(null);

  constructor(
    public dialogRef: MatDialogRef<PagoDialogComponent, MedioPago>,
    @Inject(MAT_DIALOG_DATA) public data: { total: number },
  ) {}
}
