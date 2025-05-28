import React, { memo, ErrorInfo, Component, ReactNode, useMemo } from 'react';

// Error boundary for widgets
interface WidgetErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class WidgetErrorBoundary extends Component<
  { children: ReactNode; widgetId: string; onError?: (error: Error) => void },
  WidgetErrorBoundaryState
> {
  constructor(props: { children: ReactNode; widgetId: string; onError?: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): WidgetErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Widget Error in ${this.props.widgetId}:`, error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Widget Error
          </div>
          <p className="text-sm">Failed to render {this.props.widgetId}</p>
          {this.state.error && (
            <p className="text-xs mt-1 text-red-400">{this.state.error.message}</p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component
const WidgetLoading: React.FC<{ message?: string }> = memo(({ message = 'Loading widget...' }) => (
  <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900/50 rounded-md">
    <div className="flex items-center space-x-3">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
      <span className="text-sm text-gray-600 dark:text-gray-400">{message}</span>
    </div>
  </div>
));

WidgetLoading.displayName = 'WidgetLoading';

// Error component
const WidgetError: React.FC<{ error: string; onRetry?: () => void }> = memo(({ error, onRetry }) => (
  <div className="p-4 text-center bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
    <div className="flex items-center justify-center mb-2 text-red-500">
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Error
    </div>
    <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
      >
        Retry
      </button>
    )}
  </div>
));

WidgetError.displayName = 'WidgetError';

// Widget container props
interface WidgetContainerProps {
  children: ReactNode;
  widgetId: string;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
  loadingMessage?: string;
  onRetry?: () => void;
  onError?: (error: Error) => void;
}

// Main widget container component
const WidgetContainer: React.FC<WidgetContainerProps> = memo(({
  children,
  widgetId,
  isLoading = false,
  error = null,
  className = '',
  loadingMessage,
  onRetry,
  onError
}) => {
  // Memoize the container classes to prevent unnecessary re-renders
  const containerClasses = useMemo(() => {
    const baseClasses = 'widget-container relative';
    return className ? `${baseClasses} ${className}` : baseClasses;
  }, [className]);

  return (
    <div className={containerClasses}>
      <WidgetErrorBoundary widgetId={widgetId} onError={onError}>
        {isLoading ? (
          <WidgetLoading message={loadingMessage} />
        ) : error ? (
          <WidgetError error={error} onRetry={onRetry} />
        ) : (
          children
        )}
      </WidgetErrorBoundary>
    </div>
  );
});

WidgetContainer.displayName = 'WidgetContainer';

export default WidgetContainer;
export { WidgetLoading, WidgetError, WidgetErrorBoundary };
