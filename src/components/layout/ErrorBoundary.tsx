'use client';

import React, { type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorCode: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    errorCode: '0x0000',
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
      errorCode: '0xDEAD',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[KERNEL_ERROR]', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <section className="border border-cyber-orange bg-component p-4 text-sm text-cyber-orange">
          <p>[ KERNEL ERROR ] Process crashed in user space.</p>
          <p>ERR_CODE: {this.state.errorCode}</p>
          <p>EXIT_STATUS: 1</p>
          <p className="mt-2 text-matrix-green">Run `reload` or refresh the terminal.</p>
        </section>
      );
    }

    return this.props.children;
  }
}
