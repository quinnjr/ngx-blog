import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroBlockData } from '../../../models/block.model';

@Component({
  selector: 'app-hero-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="hero-block relative flex items-center justify-{{ data.alignment }}"
      [class.h-64]="data.height === 'small'"
      [class.h-96]="data.height === 'medium'"
      [class.h-screen]="data.height === 'large' || data.height === 'full'"
      [style.background-image]="data.backgroundImage ? 'url(' + data.backgroundImage + ')' : ''"
      [class.bg-cover]="data.backgroundImage"
      [class.bg-center]="data.backgroundImage"
    >
      @if (data.overlay && data.backgroundImage) {
        <div
          class="absolute inset-0 bg-black"
          [style.opacity]="(data.overlayOpacity || 50) / 100"
        ></div>
      }

      <div class="relative z-10 container mx-auto px-4 text-white">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">{{ data.title }}</h1>
        @if (data.subtitle) {
          <p class="text-xl md:text-2xl mb-6">{{ data.subtitle }}</p>
        }
        @if (data.buttonText && data.buttonUrl) {
          <a
            [href]="data.buttonUrl"
            class="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            {{ data.buttonText }}
          </a>
        }
      </div>
    </div>
  `,
})
export class HeroBlockComponent {
  @Input({ required: true }) data!: HeroBlockData;
}
