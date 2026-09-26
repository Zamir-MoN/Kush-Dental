import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Auto-reload once on dynamic import chunk failure (common after new deployments)
    const isChunkFailed = 
      error.message?.includes('Failed to fetch dynamically imported module') ||
      error.message?.includes('Importing a module script failed') ||
      error.name === 'ChunkLoadError';

    if (isChunkFailed) {
      const hasReloaded = sessionStorage.getItem('chunk_reload_attempted');
      if (!hasReloaded) {
        sessionStorage.setItem('chunk_reload_attempted', 'true');
        window.location.reload();
      }
    }
  }

  private handleReload = () => {
    sessionStorage.removeItem('chunk_reload_attempted');
    window.location.reload();
  };

  private handleGoHome = () => {
    sessionStorage.removeItem('chunk_reload_attempted');
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isStaffRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/staff');

      return (
        <div className={`min-h-screen flex items-center justify-center p-6 ${isStaffRoute ? 'bg-[#0D0E12] text-zinc-100' : 'bg-[#FAF7F2] text-zinc-900'}`}>
          <div className={`max-w-md w-full p-8 rounded-3xl text-center border shadow-xl ${isStaffRoute ? 'bg-[#13151A] border-[#22252E]' : 'bg-white border-[#E8E2D5]'}`}>
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 mx-auto mb-4">
              <AlertCircle size={28} />
            </div>
            
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className={`text-xs mb-6 ${isStaffRoute ? 'text-zinc-400' : 'text-zinc-500'}`}>
              An unexpected error occurred while loading this view. You can reload the page or return to the main dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#DCA51B] hover:bg-[#C49216] text-[#0D0E12] transition-all cursor-pointer shadow-md active:scale-95"
              >
                <RefreshCw size={14} />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isStaffRoute 
                    ? 'border-[#2A2E3B] text-zinc-300 hover:bg-white/5' 
                    : 'border-[#E8E2D5] text-zinc-700 hover:bg-[#FAF7F2]'
                }`}
              >
                <Home size={14} />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
