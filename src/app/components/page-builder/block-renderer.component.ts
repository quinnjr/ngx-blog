import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Block } from '../../models/block.model';
import { HeroBlockComponent } from './blocks/hero-block.component';
import { TextBlockComponent } from './blocks/text-block.component';
import { ImageBlockComponent } from './blocks/image-block.component';
import { HeadingBlockComponent } from './blocks/heading-block.component';
import { ButtonBlockComponent } from './blocks/button-block.component';
import { QuoteBlockComponent } from './blocks/quote-block.component';
import { DividerBlockComponent } from './blocks/divider-block.component';
import { SpacerBlockComponent } from './blocks/spacer-block.component';

@Component({
  selector: 'app-block-renderer',
  standalone: true,
  imports: [
    CommonModule,
    HeroBlockComponent,
    TextBlockComponent,
    ImageBlockComponent,
    HeadingBlockComponent,
    ButtonBlockComponent,
    QuoteBlockComponent,
    DividerBlockComponent,
    SpacerBlockComponent,
  ],
  template: `
    <div [attr.id]="block.settings?.customId" [class]="getClasses()" [ngStyle]="getStyles()">
      @switch (block.type) {
        @case ('hero') {
          <app-hero-block [data]="block.data" />
        }
        @case ('heading') {
          <app-heading-block [data]="block.data" />
        }
        @case ('text') {
          <app-text-block [data]="block.data" />
        }
        @case ('image') {
          <app-image-block [data]="block.data" />
        }
        @case ('button') {
          <app-button-block [data]="block.data" />
        }
        @case ('quote') {
          <app-quote-block [data]="block.data" />
        }
        @case ('divider') {
          <app-divider-block [data]="block.data" />
        }
        @case ('spacer') {
          <app-spacer-block [data]="block.data" />
        }
        @default {
          <div class="p-4 bg-gray-100 text-gray-600 rounded">
            Block type "{{ block.type }}" not implemented yet
          </div>
        }
      }
    </div>
  `,
})
export class BlockRendererComponent {
  @Input({ required: true }) block!: Block;

  getClasses(): string {
    const classes = ['block'];
    if (this.block.settings?.customClass) {
      classes.push(this.block.settings.customClass);
    }
    return classes.join(' ');
  }

  getStyles(): Record<string, string> {
    return { ...this.block.styles } || {};
  }
}
