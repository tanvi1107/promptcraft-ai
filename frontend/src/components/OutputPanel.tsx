import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  FileCode2, 
  Eye, 
  AlertCircle,
  Lightbulb
} from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');

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

  const handleDownload = () => {
    if (!enhancedPrompt) return;
    const blob = new Blob([enhancedPrompt], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `enhanced-prompt-${category.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const wordCount = enhancedPrompt.trim() ? enhancedPrompt.trim().split(/\s+/).length : 0;
  const estimatedTokens = Math.round(wordCount * 1.33);

  return (
    <div className="w-full h-full flex flex-col min-h-[380px]">
      <AnimatePresence mode="wait">
        {/* Loading Skeleton */}
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col rounded-xl border border-border p-4 bg-card/40 dark:bg-card/20 space-y-3"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="h-4 w-32 bg-secondary rounded animate-pulse" />
              <div className="h-7 w-20 bg-secondary rounded-lg animate-pulse" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-3 w-4/5 bg-secondary/80 rounded animate-pulse" />
              <div className="h-3 w-full bg-secondary/80 rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-secondary/80 rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-secondary/80 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-secondary/80 rounded animate-pulse" />
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 text-center rounded-xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10"
          >
            <AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
            <h3 className="text-sm font-semibold text-foreground">Optimization Notice</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">
              {error}
            </p>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !enhancedPrompt && !error && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border/80 bg-card/20 dark:bg-card/10"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground mb-3">
              <FileCode2 className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Inspector Ready
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
              Write a rough prompt in the composer and click <strong className="text-foreground">Enhance Prompt</strong> to generate an optimized, structured result.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground/80 bg-secondary/50 px-2.5 py-1 rounded-md">
              <Lightbulb className="w-3 h-3 text-amber-500 shrink-0" />
              <span>Higher levels add edge cases and variables</span>
            </div>
          </motion.div>
        )}

        {/* Output Content */}
        {!isLoading && enhancedPrompt && !error && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col rounded-xl border border-border bg-card/60 dark:bg-card/30 overflow-hidden"
          >
            {/* Header Inspector Toolbar */}
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-border text-xs bg-secondary/20 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground text-xs">
                  {category}
                </span>
                <span className="text-border">/</span>
                <span className="text-[11px] text-muted-foreground">
                  {level}
                </span>
                <span className="text-border">|</span>
                <span className="text-[11px] text-muted-foreground">
                  {wordCount} words • ~{estimatedTokens} tokens
                </span>
              </div>

              {/* Inspector Actions */}
              <div className="flex items-center gap-1.5">
                {/* View Mode Toggle */}
                <div className="flex items-center p-0.5 rounded-lg bg-secondary/60 border border-border">
                  <button
                    type="button"
                    onClick={() => setViewMode('formatted')}
                    className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition-colors flex items-center gap-1 ${
                      viewMode === 'formatted'
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Preview</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('raw')}
                    className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition-colors flex items-center gap-1 ${
                      viewMode === 'raw'
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <FileCode2 className="w-3 h-3" />
                    <span>Raw</span>
                  </button>
                </div>

                {/* Export Markdown */}
                <button
                  type="button"
                  onClick={handleDownload}
                  title="Download as Markdown"
                  className="p-1 rounded-lg border border-border bg-card/60 hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                    copied
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                      : 'bg-primary text-primary-foreground border-primary hover:opacity-90'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Prompt Viewport */}
            <div className="flex-1 p-4 overflow-y-auto max-h-[460px] font-mono text-xs leading-relaxed text-foreground select-text">
              {viewMode === 'raw' ? (
                <pre className="whitespace-pre-wrap break-words">{enhancedPrompt}</pre>
              ) : (
                <div className="font-sans text-sm space-y-3 leading-relaxed">
                  {enhancedPrompt.split('\n\n').map((paragraph, index) => {
                    // Check if it's a markdown header
                    if (paragraph.startsWith('### ') || paragraph.startsWith('## ') || paragraph.startsWith('# ')) {
                      const headingText = paragraph.replace(/^#+\s*/, '');
                      return (
                        <h4 key={index} className="text-xs font-semibold tracking-wide uppercase text-primary pt-2 border-b border-border/40 pb-1">
                          {headingText}
                        </h4>
                      );
                    }
                    // Format list items
                    if (paragraph.startsWith('- ') || paragraph.startsWith('* ') || /^\d+\.\s/.test(paragraph)) {
                      return (
                        <ul key={index} className="space-y-1 pl-2 text-foreground/90 text-xs">
                          {paragraph.split('\n').map((line, lineIdx) => (
                            <li key={lineIdx} className="leading-normal">
                              {line.replace(/^[-*]\s*/, '• ')}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={index} className="text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
