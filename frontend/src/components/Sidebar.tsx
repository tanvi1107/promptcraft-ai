import React, { useState } from 'react';
import { Sparkles, Trash2, Search, Calendar, Folder, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface HistoryItem {
  id: string;
  originalPrompt: string;
  enhancedPrompt: string;
  category: string;
  level: 'Basic' | 'Professional' | 'Expert';
  timestamp: string;
}

interface SidebarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  history,
  onSelect,
  onDelete,
  onClearAll,
  isOpen,
  setIsOpen
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter history based on search term
  const filteredHistory = history.filter(
    (item) =>
      item.originalPrompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.enhancedPrompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Coding: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'UI/UX': 'bg-pink-500/10 text-pink-500 border-pink-500/20',
      Marketing: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      'Content Writing': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      Business: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      'Startup Ideas': 'bg-violet-500/10 text-violet-500 border-violet-500/20',
      'Image Generation': 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
      'Resume Building': 'bg-rose-500/10 text-rose-500 border-rose-500/20'
    };
    return colors[category] || 'bg-muted text-muted-foreground border-border';
  };

  const sidebarContent = (
    <div className="flex flex-col h-full w-full">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="w-5 h-5 fill-primary/10" />
          </div>
          <h2 className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            Prompt History
          </h2>
        </div>
        {/* Mobile close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden p-1.5 rounded-lg hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 border-b border-border/60">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search prompts or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl glass-input placeholder-muted-foreground"
          />
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center px-4">
            <Folder className="w-10 h-10 text-muted-foreground/30 mb-2.5" />
            <p className="text-sm font-medium text-muted-foreground">
              {searchTerm ? 'No matching prompts' : 'No saved prompts yet'}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1 max-w-[180px]">
              {searchTerm ? 'Try adjusting your search filters.' : 'Enhanced prompts will appear here.'}
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filteredHistory.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
                className="group relative flex flex-col p-3.5 rounded-xl border border-border/80 bg-card/40 hover:bg-card/90 dark:bg-card/20 dark:hover:bg-card/40 transition-all duration-300 cursor-pointer shadow-sm hover:shadow"
                onClick={() => {
                  onSelect(item);
                  // Close sidebar on mobile
                  if (window.innerWidth < 768) {
                    setIsOpen(false);
                  }
                }}
              >
                {/* Meta details */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.timestamp)}</span>
                  </div>
                </div>

                {/* Prompt Excerpt */}
                <p className="text-xs text-foreground font-medium line-clamp-2 pr-6">
                  {item.originalPrompt}
                </p>

                {/* Level indicator */}
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Level: <strong className="text-primary/90">{item.level}</strong></span>
                </div>

                {/* Delete button (shows on hover) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="absolute right-3 bottom-3 p-1.5 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Delete History Item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Sidebar Footer */}
      {history.length > 0 && (
        <div className="p-4 border-t border-border">
          <button
            onClick={onClearAll}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-rose-500/20 hover:bg-rose-500/10 text-rose-500 hover:text-rose-600 font-semibold text-xs transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
            Clear All History
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-80 h-full border-r border-border glass-panel shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] h-full bg-background border-r border-border shadow-2xl md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
