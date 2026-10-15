import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Layout, 
  Megaphone, 
  PenLine, 
  Briefcase, 
  Rocket, 
  Image, 
  FileUser, 
  ArrowUpRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const CATEGORIES = [
  { name: 'Coding', icon: Code2, short: 'Code & architecture' },
  { name: 'UI/UX', icon: Layout, short: 'Layouts & design systems' },
  { name: 'Marketing', icon: Megaphone, short: 'Copy, CTAs & growth' },
  { name: 'Content Writing', icon: PenLine, short: 'Articles & narratives' },
  { name: 'Business', icon: Briefcase, short: 'Strategy & frameworks' },
  { name: 'Startup Ideas', icon: Rocket, short: 'GTM & business models' },
  { name: 'Image Generation', icon: Image, short: 'Midjourney & DALL-E' },
  { name: 'Resume Building', icon: FileUser, short: 'ATS & action verbs' }
];

export const LEVELS = [
  { name: 'Basic', label: 'Basic', desc: 'Direct directive with grammar & intent fixes' },
  { name: 'Professional', label: 'Professional', desc: 'Expert persona, goals, constraints & output format' },
  { name: 'Expert', label: 'Expert', desc: 'Comprehensive template with variables & chain-of-thought' }
] as const;

const QUICK_STARTERS = [
  { label: 'Python scraper', category: 'Coding', level: 'Professional' as const, prompt: 'Write an asynchronous Python script using Playwright to scrape product prices and export to CSV.' },
  { label: 'SaaS landing page', category: 'Marketing', level: 'Professional' as const, prompt: 'Create landing page copy using the AIDA framework for an AI-powered calendar tool.' },
  { label: 'Modern design system', category: 'UI/UX', level: 'Expert' as const, prompt: 'Design a clean typography and color token system for a dark-mode analytics dashboard.' },
  { label: 'Pitch deck outline', category: 'Startup Ideas', level: 'Professional' as const, prompt: 'Create a 10-slide venture capital pitch deck outline for a B2B SaaS startup.' }
];

interface EnhancerPanelProps {
  onEnhance: (prompt: string, category: string, level: 'Basic' | 'Professional' | 'Expert') => void;
  isLoading: boolean;
  initialPrompt?: string;
  initialCategory?: string;
  initialLevel?: 'Basic' | 'Professional' | 'Expert';
}

export const EnhancerPanel: React.FC<EnhancerPanelProps> = ({
  onEnhance,
  isLoading,
  initialPrompt = '',
  initialCategory = 'Coding',
  initialLevel = 'Professional'
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [category, setCategory] = useState(initialCategory);
  const [level, setLevel] = useState<'Basic' | 'Professional' | 'Expert'>(initialLevel);

  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setLevel(initialLevel);
  }, [initialLevel]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onEnhance(prompt, category, level);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      {/* Category Horizontal Segmented Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
          <span>Domain Category</span>
          <span className="text-[11px] text-muted-foreground/80 font-normal">
            {CATEGORIES.find(c => c.name === category)?.short}
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setCategory(cat.name)}
                disabled={isLoading}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 border select-none ${
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm font-semibold'
                    : 'bg-card/40 dark:bg-card/20 text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Enhancement Level Segmented Switcher */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
          <span>Optimization Depth</span>
          <span className="text-[11px] text-muted-foreground/80 font-normal">
            {LEVELS.find(l => l.name === level)?.desc}
          </span>
        </div>
        <div className="grid grid-cols-3 p-1 rounded-xl bg-secondary/80 dark:bg-secondary/40 border border-border">
          {LEVELS.map((lvl) => {
            const isSelected = level === lvl.name;
            return (
              <button
                key={lvl.name}
                type="button"
                onClick={() => setLevel(lvl.name)}
                disabled={isLoading}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all duration-150 ${
                  isSelected
                    ? 'bg-card text-foreground shadow-sm font-semibold dark:bg-card/90'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Surface */}
      <div className="flex flex-col rounded-xl border border-border bg-card/60 dark:bg-card/30 overflow-hidden focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-border/70 text-xs text-muted-foreground bg-secondary/20">
          <span className="font-medium text-foreground/80">Prompt Input</span>
          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            <span className="text-border">|</span>
            <span>{prompt.length}/2000 chars</span>
            {prompt.length > 0 && !isLoading && (
              <>
                <span className="text-border">|</span>
                <button
                  type="button"
                  onClick={() => setPrompt('')}
                  className="hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Text Area */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value.slice(0, 2000))}
          onKeyDown={handleKeyDown}
          placeholder="Enter your rough prompt, instructions, or raw ideas here..."
          rows={6}
          disabled={isLoading}
          className="w-full p-3.5 bg-transparent resize-none text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
        />

        {/* Quick Starters Footer inside Editor */}
        <div className="px-3.5 py-2.5 border-t border-border/50 bg-secondary/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] text-muted-foreground font-medium shrink-0">Try example:</span>
          {QUICK_STARTERS.map((starter) => (
            <button
              key={starter.label}
              type="button"
              onClick={() => {
                setPrompt(starter.prompt);
                setCategory(starter.category);
                setLevel(starter.level);
              }}
              disabled={isLoading}
              className="text-[11px] px-2 py-0.5 rounded-md border border-border/80 bg-card hover:border-foreground/20 text-muted-foreground hover:text-foreground shrink-0 transition-colors"
            >
              {starter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 hidden sm:flex">
          <span>Press</span>
          <kbd className="kbd">Ctrl</kbd>
          <span>+</span>
          <kbd className="kbd">Enter</kbd>
          <span>to enhance</span>
        </div>

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`flex-1 sm:flex-initial sm:min-w-[180px] px-5 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all duration-150 select-none ${
            isLoading || !prompt.trim()
              ? 'bg-secondary text-muted-foreground border border-border cursor-not-allowed opacity-60'
              : 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm cursor-pointer font-semibold'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Optimizing prompt...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enhance Prompt</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
