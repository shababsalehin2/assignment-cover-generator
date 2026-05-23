// src/components/TemplateSelector.jsx
import clsx from 'clsx';
import { coverTemplates, colorThemes, fontOptions } from '../data/themes';
import { Palette, Type, Layout } from 'lucide-react';

function MiniPreview({ template }) {
  const colors = {
    classic: { top: '#1a3a5c', line: '#c8a96a', text: '#1a1a1a' },
    modern: { top: '#f8f8f8', line: '#1a3a5c', text: '#1a1a1a' },
    bordered: { top: '#ffffff', line: '#1a3a5c', text: '#1a1a1a' },
    split: { top: '#4f46e5', line: '#e8e8e8', text: '#ffffff' },
  }[template.id] || { top: '#1a3a5c', line: '#ccc', text: '#111' };

  return (
    <div className="w-full aspect-[3/4] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white">
      <div className="w-full h-1/4 flex items-center justify-center" style={{ background: colors.top }}>
        <div className="text-center px-1">
          <div className="w-4 h-0.5 mx-auto mb-0.5" style={{ background: colors.line }} />
          <div className="w-6 h-0.5 mx-auto" style={{ background: colors.line + '80' }} />
        </div>
      </div>
      <div className="p-1.5 space-y-1">
        <div className="h-1 rounded-full bg-gray-200" style={{ width: '70%', margin: '0 auto' }} />
        <div className="h-0.5 rounded-full bg-gray-100" style={{ width: '50%', margin: '0 auto' }} />
        <div className="mt-1.5 space-y-0.5">
          {[70, 55, 60, 45].map((w, i) => (
            <div key={i} className="h-0.5 rounded-full bg-gray-100" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TemplateSelector({
  selectedTemplate, onTemplateChange,
  selectedTheme, onThemeChange,
  selectedFont, onFontChange
}) {
  return (
    <div className="space-y-5">
      {/* Templates */}
      <div>
        <div className="section-title">
          <Layout className="w-3.5 h-3.5" />
          Layout Template
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {coverTemplates.map(tpl => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onTemplateChange(tpl.id)}
              className={clsx(
                'relative p-2 rounded-xl border-2 transition-all duration-150 text-left',
                selectedTemplate === tpl.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 bg-white dark:bg-surface-800'
              )}
            >
              <MiniPreview template={tpl} />
              <p className="mt-1.5 text-xs font-medium text-gray-900 dark:text-gray-100">{tpl.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{tpl.description}</p>
              {selectedTemplate === tpl.id && (
                <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-primary-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Color Themes */}
      <div>
        <div className="section-title">
          <Palette className="w-3.5 h-3.5" />
          Color Theme
        </div>
        <div className="grid grid-cols-3 gap-2">
          {colorThemes.map(theme => (
            <button
              key={theme.id}
              type="button"
              onClick={() => onThemeChange(theme)}
              className={clsx(
                'group relative p-2.5 rounded-xl border-2 transition-all duration-150 text-center',
                selectedTheme.id === theme.id
                  ? 'border-primary-500 scale-105 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:scale-105'
              )}
            >
              <div className="flex gap-1 mb-1.5 justify-center">
                <div className="w-4 h-4 rounded-full" style={{ background: theme.primary }} />
                <div className="w-4 h-4 rounded-full" style={{ background: theme.accent }} />
              </div>
              <p className="text-xs font-medium text-gray-800 dark:text-gray-200 leading-tight">{theme.name}</p>
              {selectedTheme.id === theme.id && (
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary-500 border-2 border-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Font Selection */}
      <div>
        <div className="section-title">
          <Type className="w-3.5 h-3.5" />
          Font Style
        </div>
        <div className="grid grid-cols-2 gap-2">
          {fontOptions.map(font => (
            <button
              key={font.id}
              type="button"
              onClick={() => onFontChange(font)}
              className={clsx(
                'p-3 rounded-xl border-2 transition-all duration-150 text-left',
                selectedFont.id === font.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 bg-white dark:bg-surface-800'
              )}
            >
              <span className="block text-lg mb-0.5" style={{ fontFamily: font.family }}>Aa</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">{font.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
