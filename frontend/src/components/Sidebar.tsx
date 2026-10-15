import React, { useState } from 'react';
import { 
  Trash2, 
  Search, 
  Clock, 
  FolderArchive, 
  X, 
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHistory = history.filter(
    (item) =>
      item.originalPrompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.enhancedPrompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const handleCopy = async (e: React.MouseEvent, item: HistoryItem) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(item.enhancedPrompt);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch (err) {
      console.error(err);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full w-full bg-card/90 dark:bg-card/40 backdrop-blur-md">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            History
          </h2>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-secondary text-muted-foreground">
            {history.length}
          </span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-border/60">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search saved prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg studio-input text-foreground placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* History Items List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-44 text-center px-4">
            <FolderArchive className="w-7 h-7 text-muted-foreground/40 mb-2" />
            <p className="text-xs font-medium text-muted-foreground">
              {searchTerm ? 'No matches found' : 'No prompt history'}
            </p>
            <p className="text-[11px] text-muted-foreground/70 mt-0.5 max-w-[180px]">
              {searchTerm ? 'Try a different search query' : 'Enhanced prompts will automatically save here'}
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filteredHistory.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => {
                  onSelect(item);
                  if (window.innerWidth < 1024) {
                    setIsOpen(false);
                  }
                }}
                className="group relative flex flex-col p-2.5 rounded-lg border border-transparent hover:border-border hover:bg-secondary/40 transition-all cursor-pointer select-none text-left"
              >
                {/* Meta Header */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground/80">{item.category}</span>
                    <span className="text-border">·</span>
                    <span>{item.level}</span>
                  </div>
                  <span>{formatRelativeTime(item.timestamp)}</span>
                </div>

                {/* Content Excerpt */}
                <p className="text-xs text-foreground/90 font-medium line-clamp-2 leading-relaxed">
                  {item.originalPrompt}
                </p>

                {/* Action buttons on hover */}
                <div className="mt-2 flex items-center justify-between text-[11px] pt-1.5 border-t border-border/40 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <span className="text-primary flex items-center gap-0.5 text-[10px]">
                    <span>Load</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleCopy(e, item)}
                      title="Copy enhanced prompt"
                      className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      title="Delete prompt"
                      className="p-1 rounded text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      {history.length > 0 && (
        <div className="p-3 border-t border-border/80">
          <button
            type="button"
            onClick={onClearAll}
            className="w-full py-1.5 text-[11px] text-muted-foreground hover:text-rose-500 transition-colors flex items-center justify-center gap-1.5 font-medium"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear history</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Drawer when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="hidden lg:flex flex-col h-full border-r border-border shrink-0 overflow-hidden z-20"
          >
            <div className="w-[280px] h-full">
              {sidebarContent}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile / Tablet Overlay Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] h-full shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
