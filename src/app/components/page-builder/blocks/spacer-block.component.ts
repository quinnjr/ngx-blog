import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpacerBlockData } from '../../../models/block.model';

@Component({
  selector: 'app-spacer-block',
  standalone: true,
  imports: [CommonModule],
  template: ` <div [style.height]="data.height"></div> `,
})
export class SpacerBlockComponent {
  @Input({ required: true }) data!: SpacerBlockData;
}
