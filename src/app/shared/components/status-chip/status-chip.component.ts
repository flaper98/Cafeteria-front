import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  template: `<span class="status-chip" [class]="'tone-' + tone">{{ label }}</span>`,
})
export class StatusChipComponent {
  @Input() label = '';
  @Input() tone: 'neutral' | 'info' | 'success' | 'warn' | 'danger' | 'brand' = 'neutral';
}
