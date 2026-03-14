import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      try {
        // Check if it's a Firestore permission error JSON
        const parsed = JSON.parse(this.state.error?.message || "");
        if (parsed.error && parsed.error.includes("Missing or insufficient permissions")) {
          errorMessage = "You don't have permission to perform this action. Please make sure you are signed in.";
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center space-y-6 bg-red-500/5 border border-red-500/10 rounded-[2rem]">
          <div className="p-4 bg-red-500/10 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-red-500">Something went wrong</h2>
            <p className="text-slate-400 max-w-md mx-auto">{errorMessage}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors"
          >
            <RefreshCcw className="w-4 h-4" /> Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
