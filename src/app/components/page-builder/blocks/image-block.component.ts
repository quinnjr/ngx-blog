import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageBlockData } from '../../../models/block.model';

@Component({
  selector: 'app-image-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <figure class="image-block">
      @if (data.link) {
        <a [href]="data.link">
          <img [src]="data.src" [alt]="data.alt" [ngStyle]="getImageStyles()" />
        </a>
      } @else {
        <img [src]="data.src" [alt]="data.alt" [ngStyle]="getImageStyles()" />
      }
      @if (data.caption) {
        <figcaption class="text-sm text-gray-600 text-center mt-2">{{ data.caption }}</figcaption>
      }
    </figure>
  `,
  styles: [
    `
      img {
        @apply w-full h-auto;
      }
    `,
  ],
})
export class ImageBlockComponent {
  @Input({ required: true }) data!: ImageBlockData;

  getImageStyles(): Record<string, string> {
    const styles: Record<string, string> = {};
    if (this.data.width) styles['width'] = this.data.width;
    if (this.data.height) styles['height'] = this.data.height;
    if (this.data.objectFit) styles['object-fit'] = this.data.objectFit;
    return styles;
  }
}
