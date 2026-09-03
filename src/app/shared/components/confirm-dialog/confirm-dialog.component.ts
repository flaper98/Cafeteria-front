import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="flex items-center gap-3 px-6 pt-6">
      <span
        class="rounded-full p-2 flex items-center justify-center"
        [class.bg-red-100]="data.danger"
        [class.text-red-600]="data.danger"
        [class.bg-amber-100]="!data.danger"
        [class.text-amber-700]="!data.danger"
      >
        <mat-icon>{{ data.danger ? 'warning' : 'help' }}</mat-icon>
      </span>
      <h2 class="text-lg font-semibold m-0">{{ data.title }}</h2>
    </div>
    <mat-dialog-content class="!pt-3">
      <p class="text-stone-600">{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">{{ data.cancelLabel ?? 'Cancelar' }}</button>
      <button
        mat-flat-button
        [color]="data.danger ? 'warn' : 'primary'"
        (click)="dialogRef.close(true)"
      >
        {{ data.confirmLabel ?? 'Confirmar' }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {}
}
