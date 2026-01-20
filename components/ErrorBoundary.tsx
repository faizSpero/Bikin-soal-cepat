
import React, { ErrorInfo, ReactNode, Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Fixed ErrorBoundary by extending Component directly from the react import.
 * This resolves the issue where 'props' property might not be recognized on the class instance
 * in some TypeScript environments when using React.Component.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  // Update state so the next render will show the fallback UI.
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // Catch errors in the component tree.
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    const { hasError, error } = this.state;
    // Destructuring children from this.props, which is now correctly recognized via Component<Props, State>
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Terjadi Kesalahan Aplikasi</h2>
          <p className="text-slate-600 mb-6 max-w-md text-sm">
            Mohon maaf, terjadi kendala teknis saat memuat komponen ini. 
            Silakan coba muat ulang halaman.
          </p>
          <div className="bg-white p-4 rounded-lg border border-red-200 text-left mb-6 w-full max-w-lg overflow-auto max-h-32">
             <code className="text-xs text-red-500 font-mono">
                {error?.toString()}
             </code>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Muat Ulang Halaman
          </button>
        </div>
      );
    }

    return children;
  }
}
