import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import type { HistoryItem } from './components/Sidebar';
import { EnhancerPanel } from './components/EnhancerPanel';
import { OutputPanel } from './components/OutputPanel';
import { ThemeToggle } from './components/ThemeToggle';
import { ToastContainer } from './components/Toast';
import type { ToastMessage } from './components/Toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { enhancePrompt as apiEnhancePrompt } from './services/api';
import { 
  History, 
  Layers, 
  CheckCircle2, 
  Plus
} from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('prompt_enhancer_theme', 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Persistent prompt history
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('prompt_enhancer_history', []);

  // Form states
  const [inputPrompt, setInputPrompt] = useState('');
  const [category, setCategory] = useState('Coding');
  const [level, setLevel] = useState<'Basic' | 'Professional' | 'Expert'>('Professional');

  // Execution states
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleEnhance = async (
    prompt: string,
    selectedCategory: string,
    selectedLevel: 'Basic' | 'Professional' | 'Expert'
  ) => {
    setIsLoading(true);
    setError(undefined);
    setEnhancedPrompt('');

    setInputPrompt(prompt);
    setCategory(selectedCategory);
    setLevel(selectedLevel);

    try {
      const response = await apiEnhancePrompt({
        prompt,
        category: selectedCategory,
        level: selectedLevel
      });

      setEnhancedPrompt(response.enhancedPrompt);
      addToast('Prompt optimized successfully', 'success');

      const newItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        originalPrompt: prompt,
        enhancedPrompt: response.enhancedPrompt,
        category: selectedCategory,
        level: selectedLevel,
        timestamp: new Date().toISOString()
      };

      setHistory((prev) => [newItem, ...prev]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
      addToast(err.message || 'Failed to enhance prompt', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setInputPrompt(item.originalPrompt);
    setCategory(item.category);
    setLevel(item.level);
    setEnhancedPrompt(item.enhancedPrompt);
    setError(undefined);
    addToast('Loaded prompt from history', 'info');
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Delete your entire prompt history?')) {
      setHistory([]);
      addToast('History cleared', 'info');
    }
  };

  const handleNewPrompt = () => {
    setInputPrompt('');
    setEnhancedPrompt('');
    setError(undefined);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
      {/* History Sidebar */}
      <Sidebar
        history={history}
        onSelect={handleSelectHistoryItem}
        onDelete={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top App Bar */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-border bg-card/60 dark:bg-card/30 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm tracking-tight text-foreground">
                PromptCraft
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-1.5 py-0.5 rounded border border-border bg-secondary/50">
                Studio
              </span>
            </div>

            <span className="text-border hidden sm:inline">|</span>

            {/* Quick New Prompt Button */}
            <button
              onClick={handleNewPrompt}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-secondary/60 hidden sm:flex"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Model Status Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-secondary/40 text-[11px] text-muted-foreground font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Gemini 3.8 Flash</span>
            </div>

            {/* History Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isSidebarOpen
                  ? 'bg-secondary text-foreground border-border'
                  : 'text-muted-foreground hover:text-foreground border-border/60 hover:bg-secondary/50'
              }`}
              title="Toggle Prompt History"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">History</span>
              {history.length > 0 && (
                <span className="text-[10px] font-mono px-1 rounded bg-primary/10 text-primary">
                  {history.length}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </header>

        {/* Studio Workspace Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7">
          <div className="max-w-7xl mx-auto flex flex-col gap-5">
            {/* Workspace Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-border/50">
              <div>
                <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                  Prompt Engineering Studio
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Transform raw instructions into detailed, structured prompts with context, constraints, and chain-of-thought directives.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground shrink-0">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Production Ready</span>
                </span>
              </div>
            </div>

            {/* Split Screen Workspace: Left (Composer) & Right (Inspector) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Prompt Composer */}
              <div className="lg:col-span-6 xl:col-span-7 studio-card rounded-2xl p-4 sm:p-5">
                <EnhancerPanel
                  onEnhance={handleEnhance}
                  isLoading={isLoading}
                  initialPrompt={inputPrompt}
                  initialCategory={category}
                  initialLevel={level}
                />
              </div>

              {/* Right Column: Output Inspector */}
              <div className="lg:col-span-6 xl:col-span-5 studio-card rounded-2xl p-4 sm:p-5 sticky top-6">
                <OutputPanel
                  enhancedPrompt={enhancedPrompt}
                  isLoading={isLoading}
                  category={category}
                  level={level}
                  error={error}
                  onCopy={() => addToast('Copied to clipboard', 'success')}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
