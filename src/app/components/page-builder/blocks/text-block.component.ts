import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextBlockData } from '../../../models/block.model';

@Component({
  selector: 'app-text-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="prose max-w-none" [ngStyle]="getStyles()" [innerHTML]="data.content"></div>
  `,
})
export class TextBlockComponent {
  @Input({ required: true }) data!: TextBlockData;

  getStyles(): Record<string, string> {
    const styles: Record<string, string> = {};
    if (this.data.fontSize) styles['font-size'] = this.data.fontSize;
    if (this.data.fontWeight) styles['font-weight'] = this.data.fontWeight;
    if (this.data.lineHeight) styles['line-height'] = this.data.lineHeight;
    return styles;
  }
}
