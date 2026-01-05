import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadingBlockData } from '../../../models/block.model';

@Component({
  selector: 'app-heading-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    @switch (data.level) {
      @case (1) {
        <h1 [ngStyle]="getStyles()">{{ data.text }}</h1>
      }
      @case (2) {
        <h2 [ngStyle]="getStyles()">{{ data.text }}</h2>
      }
      @case (3) {
        <h3 [ngStyle]="getStyles()">{{ data.text }}</h3>
      }
      @case (4) {
        <h4 [ngStyle]="getStyles()">{{ data.text }}</h4>
      }
      @case (5) {
        <h5 [ngStyle]="getStyles()">{{ data.text }}</h5>
      }
      @case (6) {
        <h6 [ngStyle]="getStyles()">{{ data.text }}</h6>
      }
    }
  `,
  styles: [
    `
      h1 {
        @apply text-4xl font-bold;
      }
      h2 {
        @apply text-3xl font-bold;
      }
      h3 {
        @apply text-2xl font-semibold;
      }
      h4 {
        @apply text-xl font-semibold;
      }
      h5 {
        @apply text-lg font-medium;
      }
      h6 {
        @apply text-base font-medium;
      }
    `,
  ],
})
export class HeadingBlockComponent {
  @Input({ required: true }) data!: HeadingBlockData;

  getStyles(): Record<string, string> {
    const styles: Record<string, string> = {};
    if (this.data.fontSize) styles['font-size'] = this.data.fontSize;
    if (this.data.fontWeight) styles['font-weight'] = this.data.fontWeight;
    return styles;
  }
}
