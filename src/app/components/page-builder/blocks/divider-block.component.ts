import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerBlockData } from '../../../models/block.model';

@Component({
  selector: 'app-divider-block',
  standalone: true,
  imports: [CommonModule],
  template: ` <hr [ngStyle]="getStyles()" /> `,
})
export class DividerBlockComponent {
  @Input({ required: true }) data!: DividerBlockData;

  getStyles(): Record<string, string> {
    return {
      'border-style': this.data.style,
      'border-width': this.data.thickness || '1px',
      'border-color': this.data.color || '#e5e7eb',
    };
  }
}
