// src/components/ThemeSwitcher.jsx
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../hooks/useLocalStorage';

export default function ThemeSwitcher() {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-surface-800 hover:bg-gray-200 dark:hover:bg-surface-700 transition-all duration-200 text-gray-600 dark:text-gray-300"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
