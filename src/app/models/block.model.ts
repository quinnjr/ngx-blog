/**
 * Page Builder Block Models
 */

export type BlockType =
  | 'hero'
  | 'text'
  | 'image'
  | 'heading'
  | 'button'
  | 'columns'
  | 'card-grid'
  | 'quote'
  | 'divider'
  | 'spacer'
  | 'html'
  | 'video'
  | 'gallery'
  | 'form';

export interface Block {
  id: string;
  type: BlockType;
  data: BlockData;
  styles?: BlockStyles;
  settings?: BlockSettings;
}

export interface BlockData {
  [key: string]: any;
}

export interface BlockStyles {
  margin?: string;
  padding?: string;
  backgroundColor?: string;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  maxWidth?: string;
  borderRadius?: string;
  boxShadow?: string;
}

export interface BlockSettings {
  visible?: boolean;
  animation?: string;
  customClass?: string;
  customId?: string;
}

// Specific block data types
export interface HeroBlockData extends BlockData {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  height: 'small' | 'medium' | 'large' | 'full';
  overlay?: boolean;
  overlayOpacity?: number;
  buttonText?: string;
  buttonUrl?: string;
  alignment: 'left' | 'center' | 'right';
}

export interface TextBlockData extends BlockData {
  content: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
}

export interface ImageBlockData extends BlockData {
  src: string;
  alt: string;
  caption?: string;
  width?: string;
  height?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  link?: string;
}

export interface HeadingBlockData extends BlockData {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  fontSize?: string;
  fontWeight?: string;
}

export interface ButtonBlockData extends BlockData {
  text: string;
  url: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'small' | 'medium' | 'large';
  icon?: string;
  newTab?: boolean;
}

export interface ColumnsBlockData extends BlockData {
  columns: Block[][];
  gap?: string;
  columnRatio?: number[];
}

export interface CardGridBlockData extends BlockData {
  cards: CardData[];
  columns: 2 | 3 | 4;
  gap?: string;
}

export interface CardData {
  image?: string;
  title: string;
  description: string;
  link?: string;
  buttonText?: string;
}

export interface QuoteBlockData extends BlockData {
  quote: string;
  author?: string;
  authorTitle?: string;
  style: 'default' | 'bordered' | 'highlight';
}

export interface DividerBlockData extends BlockData {
  style: 'solid' | 'dashed' | 'dotted';
  thickness?: string;
  color?: string;
}

export interface SpacerBlockData extends BlockData {
  height: string;
}

export interface HtmlBlockData extends BlockData {
  html: string;
}

export interface VideoBlockData extends BlockData {
  url: string;
  type: 'youtube' | 'vimeo' | 'file';
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export interface GalleryBlockData extends BlockData {
  images: GalleryImage[];
  layout: 'grid' | 'masonry' | 'carousel';
  columns?: 2 | 3 | 4 | 5;
  gap?: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface FormBlockData extends BlockData {
  fields: FormField[];
  submitText: string;
  submitUrl: string;
  successMessage: string;
}

export interface FormField {
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox';
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

// Block Registry
export interface BlockDefinition {
  type: BlockType;
  label: string;
  icon: string;
  category: 'content' | 'media' | 'layout' | 'interactive';
  defaultData: BlockData;
  defaultStyles?: BlockStyles;
}

export const BLOCK_REGISTRY: BlockDefinition[] = [
  {
    type: 'hero',
    label: 'Hero Section',
    icon: 'panorama',
    category: 'content',
    defaultData: {
      title: 'Welcome to Our Site',
      subtitle: 'Build something amazing',
      height: 'large',
      alignment: 'center',
    } as HeroBlockData,
    defaultStyles: { padding: '4rem 1rem', textAlign: 'center' },
  },
  {
    type: 'heading',
    label: 'Heading',
    icon: 'title',
    category: 'content',
    defaultData: { text: 'Heading', level: 2 } as HeadingBlockData,
    defaultStyles: { margin: '1rem 0' },
  },
  {
    type: 'text',
    label: 'Text',
    icon: 'notes',
    category: 'content',
    defaultData: { content: 'Add your text here...' } as TextBlockData,
    defaultStyles: { margin: '1rem 0' },
  },
  {
    type: 'image',
    label: 'Image',
    icon: 'image',
    category: 'media',
    defaultData: {
      src: 'https://via.placeholder.com/800x400',
      alt: 'Placeholder',
      objectFit: 'cover',
    } as ImageBlockData,
    defaultStyles: { margin: '1rem 0' },
  },
  {
    type: 'button',
    label: 'Button',
    icon: 'smart_button',
    category: 'interactive',
    defaultData: {
      text: 'Click Me',
      url: '#',
      variant: 'primary',
      size: 'medium',
    } as ButtonBlockData,
    defaultStyles: { margin: '1rem 0' },
  },
  {
    type: 'columns',
    label: 'Columns',
    icon: 'view_column',
    category: 'layout',
    defaultData: { columns: [[], []], gap: '2rem' } as ColumnsBlockData,
    defaultStyles: { margin: '2rem 0' },
  },
  {
    type: 'card-grid',
    label: 'Card Grid',
    icon: 'grid_view',
    category: 'layout',
    defaultData: {
      cards: [
        { title: 'Card 1', description: 'Description 1' },
        { title: 'Card 2', description: 'Description 2' },
        { title: 'Card 3', description: 'Description 3' },
      ],
      columns: 3,
      gap: '2rem',
    } as CardGridBlockData,
    defaultStyles: { margin: '2rem 0' },
  },
  {
    type: 'quote',
    label: 'Quote',
    icon: 'format_quote',
    category: 'content',
    defaultData: {
      quote: 'This is an inspiring quote.',
      author: 'Author Name',
      style: 'default',
    } as QuoteBlockData,
    defaultStyles: { margin: '2rem 0', padding: '2rem' },
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: 'horizontal_rule',
    category: 'layout',
    defaultData: { style: 'solid', thickness: '1px' } as DividerBlockData,
    defaultStyles: { margin: '2rem 0' },
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: 'height',
    category: 'layout',
    defaultData: { height: '3rem' } as SpacerBlockData,
  },
  {
    type: 'video',
    label: 'Video',
    icon: 'videocam',
    category: 'media',
    defaultData: {
      url: '',
      type: 'youtube',
      controls: true,
    } as VideoBlockData,
    defaultStyles: { margin: '2rem 0' },
  },
  {
    type: 'gallery',
    label: 'Gallery',
    icon: 'collections',
    category: 'media',
    defaultData: {
      images: [],
      layout: 'grid',
      columns: 3,
      gap: '1rem',
    } as GalleryBlockData,
    defaultStyles: { margin: '2rem 0' },
  },
  {
    type: 'html',
    label: 'Custom HTML',
    icon: 'code',
    category: 'content',
    defaultData: { html: '<div>Custom HTML</div>' } as HtmlBlockData,
    defaultStyles: { margin: '1rem 0' },
  },
];
