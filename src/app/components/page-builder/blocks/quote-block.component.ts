import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteBlockData } from '../../../models/block.model';

@Component({
  selector: 'app-quote-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <blockquote [class]="getQuoteClasses()">
      <p class="text-xl italic mb-4">"{{ data.quote }}"</p>
      @if (data.author) {
        <footer class="text-sm">
          <cite class="font-semibold not-italic">— {{ data.author }}</cite>
          @if (data.authorTitle) {
            <span class="text-gray-600">, {{ data.authorTitle }}</span>
          }
        </footer>
      }
    </blockquote>
  `,
})
export class QuoteBlockComponent {
  @Input({ required: true }) data!: QuoteBlockData;

  getQuoteClasses(): string {
    const classes = ['quote-block'];

    switch (this.data.style) {
      case 'bordered':
        classes.push('border-l-4 border-blue-600 pl-6');
        break;
      case 'highlight':
        classes.push('bg-blue-50 p-6 rounded-lg');
        break;
      default:
        classes.push('text-center');
    }

    return classes.join(' ');
  }
}
