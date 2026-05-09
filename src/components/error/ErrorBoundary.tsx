import React, { Component } from "react";

import ErrorBoundaryFallback from "./ErrorBoundaryFallback";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackComponent?: React.ReactNode;
  title?: string;
  description?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // This is called when there is an error during the rendering
    // Once the error is there will update the state to display the Error UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // This function is generally use to run side effects when error is caught. As the getDerivedStateFromError
    //  is a pure function
    // We cannot run side effects there.
    console.log(error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { children, fallbackComponent, title, description } = this.props;
    if (hasError && error) {
      // Render any Fallback UI

      if (fallbackComponent) {
        return fallbackComponent;
      }
      return (
        <ErrorBoundaryFallback
          title={title}
          description={description}
          error={error}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;
