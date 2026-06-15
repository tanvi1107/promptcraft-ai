import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Palette, 
  Megaphone, 
  PenTool, 
  Briefcase, 
  Lightbulb, 
  Image as ImageIcon, 
  FileText, 
  Zap
} from 'lucide-react';

export const CATEGORIES = [
  { name: 'Coding', icon: Terminal, desc: 'Syntax, modularity & structure' },
  { name: 'UI/UX', icon: Palette, desc: 'Accessibility, layouts & states' },
  { name: 'Marketing', icon: Megaphone, desc: 'Target audience, CTAs & hooks' },
  { name: 'Content Writing', icon: PenTool, desc: 'Tone, formatting & readability' },
  { name: 'Business', icon: Briefcase, desc: 'Objectives, risk & positioning' },
  { name: 'Startup Ideas', icon: Lightbulb, desc: 'Market fit, loops & economics' },
  { name: 'Image Generation', icon: ImageIcon, desc: 'Lighting, styles & camera detail' },
  { name: 'Resume Building', icon: FileText, desc: 'ATS rules, metrics & action verbs' }
];

export const LEVELS = [
  { name: 'Basic', tag: 'Direct', desc: 'Fixes grammar, makes intent clear' },
  { name: 'Professional', tag: 'Structured', desc: 'Adds role persona, goals & constraints' },
  { name: 'Expert', tag: 'Template', desc: 'Includes variables, reasoning & edge-cases' }
] as const;

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

  // Sync state if initialProps change (e.g. reloading from history)
  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setLevel(initialLevel);
  }, [initialLevel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onEnhance(prompt, category, level);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      {/* Prompt Text Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold tracking-tight text-foreground/95 flex items-center justify-between">
          <span>Enter Rough Prompt</span>
          <span className="text-xs text-muted-foreground font-normal">
            {prompt.length} / 2000 chars
          </span>
        </label>
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, 2000))}
            placeholder="Type your basic prompt idea here (e.g., 'write a python script to scan local files and sort them')..."
            rows={5}
            disabled={isLoading}
            className="w-full p-4 rounded-2xl glass-input placeholder-muted-foreground/60 resize-none text-sm leading-relaxed"
          />
        </div>
      </div>

      {/* Categories Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold tracking-tight text-foreground/95 flex items-center justify-between">
          <span>Select Category</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setCategory(cat.name)}
                disabled={isLoading}
                className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all duration-300 ${
                  isSelected
                    ? 'border-primary bg-primary/5 text-primary shadow-[0_0_15px_rgba(139,92,246,0.1)] ring-1 ring-primary'
                    : 'border-border/60 bg-card/25 dark:bg-card/10 hover:border-primary/40 hover:bg-foreground/[0.02] text-foreground'
                }`}
              >
                <div className={`p-2 rounded-xl mb-3 ${isSelected ? 'bg-primary/15 text-primary' : 'bg-foreground/5 text-muted-foreground'}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span className="text-sm font-bold tracking-tight mb-0.5">{cat.name}</span>
                <span className="text-[10px] text-muted-foreground leading-tight">{cat.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Levels Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold tracking-tight text-foreground/95">
          <span>Enhancement Level</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {LEVELS.map((lvl) => {
            const isSelected = level === lvl.name;
            return (
              <button
                key={lvl.name}
                type="button"
                onClick={() => setLevel(lvl.name)}
                disabled={isLoading}
                className={`flex flex-col p-3.5 rounded-2xl border text-left transition-all duration-300 ${
                  isSelected
                    ? 'border-primary bg-primary/5 text-primary shadow-[0_0_15px_rgba(139,92,246,0.1)] ring-1 ring-primary'
                    : 'border-border/60 bg-card/25 dark:bg-card/10 hover:border-primary/40 hover:bg-foreground/[0.02] text-foreground'
                }`}
              >
                <div className="flex items-center justify-between mb-2 w-full">
                  <span className="text-sm font-bold tracking-tight">{lvl.name}</span>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-primary/20 text-primary' : 'bg-foreground/10 text-muted-foreground'
                  }`}>
                    {lvl.tag}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground leading-relaxed">{lvl.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className={`w-full py-4 px-6 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 select-none shadow-[0_4px_20px_-4px_rgba(139,92,246,0.4)] ${
          isLoading || !prompt.trim()
            ? 'bg-muted border border-border/80 text-muted-foreground cursor-not-allowed shadow-none'
            : 'bg-primary hover:bg-primary-hover text-primary-foreground hover:scale-[1.01] hover:shadow-[0_4px_25px_-2px_rgba(139,92,246,0.6)] cursor-pointer'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Analyzing Intent & Optimizing...
          </>
        ) : (
          <>
            <Zap className="w-4.5 h-4.5 fill-current" />
            Enhance Prompt
          </>
        )}
      </button>
    </form>
  );
};
