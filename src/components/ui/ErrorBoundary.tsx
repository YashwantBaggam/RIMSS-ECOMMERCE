'use client';

import React from 'react';
import { logger } from '@/lib/logger';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const log = logger('client:error-boundary');

interface Props {
  children: React.ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary — catches uncaught render errors in any child component tree.
 * Logs the error with structured context (module name, component stack).
 * Shows a user-friendly fallback UI instead of a blank screen.
 *
 * Wrap any module-level component:
 *   <ErrorBoundary moduleName="search">
 *     <SearchResults ... />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    log.error(
      `Unhandled render error in module "${this.props.moduleName ?? 'unknown'}"`,
      error,
      {
        moduleName:     this.props.moduleName,
        componentStack: info.componentStack ?? undefined,
      }
    );
  }

  handleReset = () => {
    log.info('Error boundary reset by user', { moduleName: this.props.moduleName });
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4 p-8 bg-red-50 border border-red-100 rounded-xl text-center">
          <AlertTriangle className="w-10 h-10 text-red-400" />
          <div>
            <p className="font-semibold text-red-700">Something went wrong</p>
            <p className="text-sm text-red-500 mt-1">
              {process.env.NODE_ENV === 'development'
                ? this.state.error?.message
                : 'An unexpected error occurred. Please try again.'}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
