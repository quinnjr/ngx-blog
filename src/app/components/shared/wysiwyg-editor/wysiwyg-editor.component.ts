import {
  Component,
  ElementRef,
  ViewChild,
  forwardRef,
  OnInit,
  OnDestroy,
  Input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Quill from 'quill';

// Quill modules
import 'quill/dist/quill.snow.css';

@Component({
  selector: 'app-wysiwyg-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wysiwyg-editor.component.html',
  styleUrls: ['./wysiwyg-editor.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WysiwygEditorComponent),
      multi: true,
    },
  ],
})
export class WysiwygEditorComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild('editor', { static: true }) editorElement!: ElementRef;
  @Input() placeholder = 'Write your content here...';
  @Input() readOnly = false;
  @Input() height = '400px';
  @Input() theme: 'snow' | 'bubble' = 'snow';

  private quill: Quill | null = null;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  isDisabled = signal(false);
  characterCount = signal(0);
  wordCount = signal(0);

  ngOnInit(): void {
    this.initializeEditor();
  }

  ngOnDestroy(): void {
    if (this.quill) {
      this.quill = null;
    }
  }

  private initializeEditor(): void {
    const toolbarOptions = [
      // Headers
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      // Font size
      [{ size: ['small', false, 'large', 'huge'] }],

      // Text formatting
      ['bold', 'italic', 'underline', 'strike'],

      // Colors
      [{ color: [] }, { background: [] }],

      // Text alignment
      [{ align: [] }],

      // Lists
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],

      // Blocks
      ['blockquote', 'code-block'],

      // Links and media
      ['link', 'image', 'video'],

      // Clear formatting
      ['clean'],
    ];

    this.quill = new Quill(this.editorElement.nativeElement, {
      theme: this.theme,
      placeholder: this.placeholder,
      readOnly: this.readOnly,
      modules: {
        toolbar: toolbarOptions,
        clipboard: {
          matchVisual: false,
        },
      },
    });

    // Listen for text changes
    this.quill.on('text-change', () => {
      if (this.quill) {
        const html = this.quill.root.innerHTML;
        const text = this.quill.getText();

        // Update counts
        this.characterCount.set(text.length);
        this.wordCount.set(this.countWords(text));

        // Emit value change
        this.onChange(html === '<p><br></p>' ? '' : html);
        this.onTouched();
      }
    });

    // Listen for selection changes (for focus/blur)
    this.quill.on('selection-change', (range) => {
      if (!range) {
        this.onTouched();
      }
    });
  }

  private countWords(text: string): number {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    if (this.quill) {
      if (value) {
        const delta = this.quill.clipboard.convert({ html: value });
        this.quill.setContents(delta, 'silent');

        const text = this.quill.getText();
        this.characterCount.set(text.length);
        this.wordCount.set(this.countWords(text));
      } else {
        this.quill.setText('');
        this.characterCount.set(0);
        this.wordCount.set(0);
      }
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
    if (this.quill) {
      this.quill.enable(!isDisabled);
    }
  }

  // Public methods
  getHTML(): string {
    return this.quill?.root.innerHTML || '';
  }

  getText(): string {
    return this.quill?.getText() || '';
  }

  getLength(): number {
    return this.quill?.getLength() || 0;
  }

  insertText(text: string): void {
    if (this.quill) {
      const selection = this.quill.getSelection();
      const index = selection ? selection.index : this.quill.getLength();
      this.quill.insertText(index, text);
    }
  }

  insertHTML(html: string): void {
    if (this.quill) {
      const selection = this.quill.getSelection();
      const index = selection ? selection.index : this.quill.getLength();
      const delta = this.quill.clipboard.convert({ html });
      this.quill.updateContents(delta, 'user');
    }
  }

  focus(): void {
    this.quill?.focus();
  }

  blur(): void {
    this.quill?.blur();
  }

  clear(): void {
    if (this.quill) {
      this.quill.setText('');
      this.characterCount.set(0);
      this.wordCount.set(0);
    }
  }
}
