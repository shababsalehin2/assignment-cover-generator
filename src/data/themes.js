// src/data/themes.js

export const colorThemes = [
  {
    id: 'classic',
    name: 'Classic Blue',
    primary: '#1a3a5c',
    accent: '#c8a96a',
    border: '#1a3a5c',
    headerBg: '#1a3a5c',
    headerText: '#ffffff',
    description: 'Traditional academic styling'
  },
  {
    id: 'emerald',
    name: 'Forest Green',
    primary: '#1b5e20',
    accent: '#81c784',
    border: '#1b5e20',
    headerBg: '#1b5e20',
    headerText: '#ffffff',
    description: 'Natural and elegant'
  },
  {
    id: 'crimson',
    name: 'Royal Crimson',
    primary: '#7f1d1d',
    accent: '#fca5a5',
    border: '#7f1d1d',
    headerBg: '#7f1d1d',
    headerText: '#ffffff',
    description: 'Bold and prestigious'
  },
  {
    id: 'midnight',
    name: 'Midnight',
    primary: '#0f172a',
    accent: '#818cf8',
    border: '#334155',
    headerBg: '#0f172a',
    headerText: '#f8fafc',
    description: 'Sleek and modern'
  },
  {
    id: 'royal',
    name: 'Royal Purple',
    primary: '#4a148c',
    accent: '#ce93d8',
    border: '#4a148c',
    headerBg: '#4a148c',
    headerText: '#ffffff',
    description: 'Regal and distinguished'
  },
  {
    id: 'teal',
    name: 'Teal Scholar',
    primary: '#004d40',
    accent: '#80cbc4',
    border: '#004d40',
    headerBg: '#004d40',
    headerText: '#ffffff',
    description: 'Sophisticated and calm'
  },
];

export const coverTemplates = [
  {
    id: 'classic',
    name: 'Classic Academic',
    description: 'Traditional university cover with centered layout',
    preview: 'classic'
  },
  {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Clean lines with left-aligned content',
    preview: 'modern'
  },
  {
    id: 'bordered',
    name: 'Bordered Formal',
    description: 'Double border with ornamental styling',
    preview: 'bordered'
  },
  {
    id: 'split',
    name: 'Split Header',
    description: 'Bold colored header with clean body',
    preview: 'split'
  }
];

export const fontOptions = [
  { id: 'serif', name: 'Serif Classic', family: "'Georgia', serif", preview: 'Aa' },
  { id: 'playfair', name: 'Playfair', family: "'Playfair Display', serif", preview: 'Aa' },
  { id: 'sans', name: 'Sans Modern', family: "'Source Sans 3', sans-serif", preview: 'Aa' },
  { id: 'times', name: 'Times Style', family: "'Times New Roman', serif", preview: 'Aa' },
];
