'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[#0a192f] text-white p-6">
                    <div className="max-w-md text-center">
                        <h1 className="text-4xl font-bold text-[var(--accent)] mb-4">Oups !</h1>
                        <p className="text-xl mb-6">Une erreur inattendue s'est produite.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 rounded-md border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#0a192f] transition-all duration-300"
                        >
                            Actualiser la page
                        </button>
                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-8 p-4 bg-red-900/30 rounded-lg text-left overflow-auto max-h-60 text-sm font-mono">
                                {this.state.error?.toString()}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
