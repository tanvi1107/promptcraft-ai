import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl border border-border glass-panel hover:bg-foreground/5 dark:hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40"
      aria-label="Toggle Theme Mode"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0, scale: theme === 'dark' ? 0 : 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={theme === 'dark' ? 'absolute inset-0 m-auto w-5 h-5 flex items-center justify-center' : ''}
      >
        <Sun className="w-5 h-5 text-amber-500" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'light' ? -180 : 0, scale: theme === 'light' ? 0 : 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={theme === 'light' ? 'absolute inset-0 m-auto w-5 h-5 flex items-center justify-center' : ''}
      >
        <Moon className="w-5 h-5 text-indigo-400" />
      </motion.div>
      <span className="sr-only">Toggle Theme</span>
    </button>
  );
};
