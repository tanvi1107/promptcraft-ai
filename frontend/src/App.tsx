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
import { Sparkles, Menu, Command } from 'lucide-react';

export default function App() {
  // 1. Theme Configuration
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('prompt_enhancer_theme', 'dark');

  // Synchronize theme with document element classes
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

  // 2. Persistent History
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('prompt_enhancer_history', []);

  // 3. Form States
  const [inputPrompt, setInputPrompt] = useState('');
  const [category, setCategory] = useState('Coding');
  const [level, setLevel] = useState<'Basic' | 'Professional' | 'Expert'>('Professional');
  
  // 4. API Results & UI States
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 5. Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // 6. Action Handlers
  const handleEnhance = async (
    prompt: string,
    selectedCategory: string,
    selectedLevel: 'Basic' | 'Professional' | 'Expert'
  ) => {
    setIsLoading(true);
    setError(undefined);
    setEnhancedPrompt('');

    // Update form state values so the panels synchronize visual selection
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
      addToast('Prompt optimized successfully!', 'success');

      // Create new history entry
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
      addToast(err.message || 'Failed to enhance prompt.', 'error');
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
    addToast(`Loaded prompt from history`, 'info');
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    addToast('Prompt removed from history', 'info');
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to delete your entire history? This cannot be undone.')) {
      setHistory([]);
      addToast('All history cleared', 'info');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-colors duration-300 relative">
      {/* Visual background ambient mesh glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />

      {/* Sidebar Panel */}
      <Sidebar
        history={history}
        onSelect={handleSelectHistoryItem}
        onDelete={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Navigation / Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border/80 glass-panel backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            {/* Mobile Menu trigger */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl border border-border hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Open History"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary text-primary-foreground hidden md:flex">
                <Command className="w-4 h-4" />
              </div>
              <span className="font-extrabold tracking-tight text-base sm:text-lg bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Prompt<span className="text-primary">Forge</span>
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary tracking-wide hidden sm:inline-block">
                SaaS v1.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </header>

        {/* Workspace Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto flex flex-col gap-6 h-full">
            {/* Gradient Hero Section */}
            <div className="text-center md:text-left py-4 sm:py-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/25 bg-primary/5 text-primary text-xs font-semibold tracking-wide mb-3 animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 fill-primary/10" />
                <span>Powered by GPT-4o Mini</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent leading-none">
                Transform rough prompts into AI code.
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-xl leading-relaxed">
                Elevate your outputs. Add context, structure format, edge-cases, and strict persona guidelines automatically.
              </p>
            </div>

            {/* Split Editor / Output Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
              {/* Left Column: Form Editor */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="glass-panel-glow border border-border/80 rounded-3xl p-5 sm:p-7 flex-1 flex flex-col">
                  <h2 className="text-base font-bold tracking-tight text-foreground/90 mb-5 flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-primary" />
                    Prompt Customizer
                  </h2>
                  <EnhancerPanel
                    onEnhance={handleEnhance}
                    isLoading={isLoading}
                    initialPrompt={inputPrompt}
                    initialCategory={category}
                    initialLevel={level}
                  />
                </div>
              </div>

              {/* Right Column: Output Viewer */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="glass-panel border border-border/80 rounded-3xl p-5 sm:p-7 flex-1 flex flex-col justify-between">
                  <div className="flex flex-col gap-1.5 mb-5">
                    <h2 className="text-base font-bold tracking-tight text-foreground/90 flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-indigo-500" />
                      Optimized Output
                    </h2>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <OutputPanel
                      enhancedPrompt={enhancedPrompt}
                      isLoading={isLoading}
                      category={category}
                      level={level}
                      error={error}
                      onCopy={() => addToast('Prompt copied to clipboard!', 'success')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Notifications Layer */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
