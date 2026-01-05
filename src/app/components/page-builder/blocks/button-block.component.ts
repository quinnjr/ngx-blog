import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonBlockData } from '../../../models/block.model';

@Component({
  selector: 'app-button-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <a
      [href]="data.url"
      [target]="data.newTab ? '_blank' : '_self'"
      [class]="getButtonClasses()"
    >
      @if (data.icon) {
        <span class="material-icons">{{ data.icon }}</span>
      }
      {{ data.text }}
    </a>
  `,
  styles: [
    `
      a {
        @apply inline-flex items-center gap-2 font-semibold rounded-lg transition;
      }
    `,
  ],
})
export class ButtonBlockComponent {
  @Input({ required: true }) data!: ButtonBlockData;

  getButtonClasses(): string {
    const classes = ['button'];

    // Variant
    switch (this.data.variant) {
      case 'primary':
        classes.push('bg-blue-600 hover:bg-blue-700 text-white');
        break;
      case 'secondary':
        classes.push('bg-gray-600 hover:bg-gray-700 text-white');
        break;
      case 'outline':
        classes.push('border-2 border-blue-600 text-blue-600 hover:bg-blue-50');
        break;
      case 'ghost':
        classes.push('text-blue-600 hover:bg-blue-50');
        break;
    }

    // Size
    switch (this.data.size) {
      case 'small':
        classes.push('px-4 py-2 text-sm');
        break;
      case 'medium':
        classes.push('px-6 py-3 text-base');
        break;
      case 'large':
        classes.push('px-8 py-4 text-lg');
        break;
    }

    return classes.join(' ');
  }
}
