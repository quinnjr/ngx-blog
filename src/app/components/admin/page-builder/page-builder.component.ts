import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Block, BLOCK_REGISTRY, BlockDefinition } from '../../../models/block.model';
import { BlockRendererComponent } from '../../page-builder/block-renderer.component';

@Component({
  selector: 'app-page-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, BlockRendererComponent],
  templateUrl: './page-builder.component.html',
  styleUrl: './page-builder.component.css',
})
export class PageBuilderComponent {
  blocks = signal<Block[]>([]);
  selectedBlock = signal<Block | null>(null);
  blockRegistry = BLOCK_REGISTRY;

  showBlockLibrary = signal(false);
  previewMode = signal(false);

  // Add block from library
  addBlock(definition: BlockDefinition) {
    const block: Block = {
      id: crypto.randomUUID(),
      type: definition.type,
      data: { ...definition.defaultData },
      styles: { ...definition.defaultStyles },
      settings: { visible: true },
    };
    this.blocks.update(blocks => [...blocks, block]);
    this.selectBlock(block);
    this.showBlockLibrary.set(false);
  }

  // Drag and drop reorder
  dropBlock(event: CdkDragDrop<Block[]>) {
    const blocks = [...this.blocks()];
    moveItemInArray(blocks, event.previousIndex, event.currentIndex);
    this.blocks.set(blocks);
  }

  // Select block for editing
  selectBlock(block: Block) {
    this.selectedBlock.set(block);
  }

  // Duplicate block
  duplicateBlock(block: Block) {
    const duplicate: Block = {
      ...block,
      id: crypto.randomUUID(),
    };
    const index = this.blocks().indexOf(block);
    this.blocks.update(blocks => {
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, duplicate);
      return newBlocks;
    });
  }

  // Delete block
  deleteBlock(block: Block) {
    this.blocks.update(blocks => blocks.filter(b => b.id !== block.id));
    if (this.selectedBlock() === block) {
      this.selectedBlock.set(null);
    }
  }

  // Move block up/down
  moveBlockUp(block: Block) {
    const blocks = [...this.blocks()];
    const index = blocks.indexOf(block);
    if (index > 0) {
      [blocks[index], blocks[index - 1]] = [blocks[index - 1], blocks[index]];
      this.blocks.set(blocks);
    }
  }

  moveBlockDown(block: Block) {
    const blocks = [...this.blocks()];
    const index = blocks.indexOf(block);
    if (index < blocks.length - 1) {
      [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]];
      this.blocks.set(blocks);
    }
  }

  // Save/Export
  exportBlocks(): string {
    return JSON.stringify(this.blocks(), null, 2);
  }

  importBlocks(json: string) {
    try {
      const blocks = JSON.parse(json);
      this.blocks.set(blocks);
      this.selectedBlock.set(null);
    } catch (e) {
      alert('Invalid JSON');
    }
  }

  // Clear all
  clearAll() {
    if (confirm('Delete all blocks?')) {
      this.blocks.set([]);
      this.selectedBlock.set(null);
    }
  }
}
