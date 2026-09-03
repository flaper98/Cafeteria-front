import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="flex flex-col items-center justify-center text-center py-16 px-6 text-stone-400">
      <mat-icon class="!w-12 !h-12 !text-5xl mb-3 opacity-60">{{ icon }}</mat-icon>
      <p class="font-medium text-stone-600">{{ title }}</p>
      @if (message) {
        <p class="text-sm mt-1 max-w-sm">{{ message }}</p>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'Sin datos por ahora';
  @Input() message?: string;
}
