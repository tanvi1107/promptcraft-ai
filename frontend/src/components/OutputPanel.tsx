import React, { useState, useEffect } from 'react';
import { Copy, Check, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OutputPanelProps {
  enhancedPrompt: string;
  isLoading: boolean;
  onCopy: () => void;
  category: string;
  level: string;
  error?: string;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  enhancedPrompt,
  isLoading,
  onCopy,
  category,
  level,
  error
}) => {
  const [copied, setCopied] = useState(false);

  // Reset copied state when prompt changes
  useEffect(() => {
    setCopied(false);
  }, [enhancedPrompt]);

  const handleCopy = async () => {
    if (!enhancedPrompt) return;
    try {
      await navigator.clipboard.writeText(enhancedPrompt);
      setCopied(true);
      onCopy();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col">
      <AnimatePresence mode="wait">
        {/* 1. Loading Skeleton */}
        {isLoading && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-36 bg-foreground/10 rounded-lg shimmer-bg" />
              <div className="h-9 w-24 bg-foreground/10 rounded-xl shimmer-bg" />
            </div>
            <div className="flex-1 p-5 rounded-2xl border border-border/60 bg-card/25 dark:bg-card/10 flex flex-col gap-3.5">
              <div className="h-4 w-[90%] bg-foreground/10 rounded shimmer-bg" />
              <div className="h-4 w-[85%] bg-foreground/10 rounded shimmer-bg" />
              <div className="h-4 w-[60%] bg-foreground/10 rounded shimmer-bg" />
              <div className="h-4 w-[75%] bg-foreground/10 rounded shimmer-bg" />
              <div className="h-4 w-[80%] bg-foreground/10 rounded shimmer-bg" />
              <div className="h-4 w-[45%] bg-foreground/10 rounded shimmer-bg" />
            </div>
          </motion.div>
        )}

        {/* 2. Error State */}
        {!isLoading && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-rose-500/20 bg-rose-500/[0.02] dark:bg-rose-500/[0.04]"
          >
            <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
            <h3 className="text-base font-bold text-foreground mb-1.5">Optimization Failed</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-5 leading-relaxed">
              {error}
            </p>
          </motion.div>
        )}

        {/* 3. Empty State */}
        {!isLoading && !enhancedPrompt && !error && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center border border-dashed border-border/80 rounded-2xl"
          >
            <Sparkles className="w-12 h-12 text-muted-foreground/30 mb-4 animate-pulse" />
            <h3 className="text-sm font-bold text-foreground mb-1.5">Your Enhanced Prompt Awaits</h3>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Input a rough concept in the editor and click "Enhance Prompt" to generate a tailored, professional-grade prompt structure.
            </p>
          </motion.div>
        )}

        {/* 4. Display Enhanced Prompt */}
        {!isLoading && enhancedPrompt && !error && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col gap-4"
          >
            {/* Header controls */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
                <span className="text-primary font-bold">Optimized Prompt</span>
                <span className="text-muted-foreground/40 font-normal">|</span>
                <span className="text-xs text-muted-foreground font-normal bg-foreground/5 dark:bg-foreground/10 px-2.5 py-1 rounded-lg">
                  {category} • {level}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-all duration-300 shadow-sm ${
                  copied
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'glass-panel border-border/80 hover:border-primary/40 text-foreground hover:bg-foreground/[0.02]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
                    Copy to Clipboard
                  </>
                )}
              </button>
            </div>

            {/* Prompt Render Panel */}
            <div className="flex-1 p-5 rounded-2xl border border-border/80 bg-card/30 dark:bg-card/10 backdrop-blur-md overflow-hidden flex flex-col shadow-inner">
              <div className="flex-1 overflow-y-auto max-h-[350px] pr-2">
                <pre className="text-sm text-foreground/90 font-mono whitespace-pre-wrap break-words leading-relaxed selection:bg-primary/20">
                  {enhancedPrompt}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
