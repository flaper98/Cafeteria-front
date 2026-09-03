import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-[var(--brand-ink)]">{{ title }}</h1>
        @if (subtitle) {
          <p class="text-sm text-stone-500 mt-1">{{ subtitle }}</p>
        }
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle?: string;
}
