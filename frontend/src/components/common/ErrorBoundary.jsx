import React, { Component } from 'react';
import ErrorState from './ErrorState';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught component error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
          <div className="w-full max-w-lg">
            <ErrorState
              title="Application Error"
              message={this.state.error?.message || 'An unexpected rendering error occurred.'}
              onRetry={this.handleReset}
            />
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
