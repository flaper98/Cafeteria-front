import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="card-surface p-4 flex items-start gap-3">
      <span class="rounded-xl p-2.5 flex items-center justify-center" [style.background]="iconBg" [style.color]="iconColor">
        <mat-icon>{{ icon }}</mat-icon>
      </span>
      <div class="min-w-0">
        <p class="text-xs font-medium text-stone-500 truncate">{{ label }}</p>
        <p class="text-xl font-semibold text-[var(--brand-ink)] leading-tight mt-0.5">{{ value }}</p>
        @if (hint) {
          <p class="text-xs text-stone-400 mt-0.5">{{ hint }}</p>
        }
      </div>
    </div>
  `,
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() hint?: string;
  @Input() icon = 'analytics';
  @Input() iconColor = 'var(--brand-forest)';
  @Input() iconBg = '#eaf3ec';
}
